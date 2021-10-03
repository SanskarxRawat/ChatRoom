var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongo=require('mongodb').MongoClient;
var client=require('socket.io').listen(3000).sockets;
const socket = io('http://localhost:3000');


var appRoutes = require('./routes/app');

var app = express();

//Connect to mongo
mongo.connect('mongodb://127.0.0.1/chat',function(err,db){
    if(err){
      throw err;
    }
    console.log('MongoDB connected...');

    //Connect to Socket io
    client.on('connection',function(){
      let chat =db.collection('chats');

      //Create function to send status
      sendStatus=function(s){
        socket.emmit('status',s);
      }

      //Get chats from collection
      chat.find().limit(200).sort({_id:1}).toArray(function(err,res){
          if(err){
            throw err;
          }
          //emmit the messages
          socket.emmit('output',res);
      });
      //Handle input events
      socket.on('input',function(data){
        let name=data.name;
        let message=data.message;
        //Check for name and message
      if(name=='' || message==''){
        //Send error status
        sendStatus('Someting went wrong');
      }
      else{
        //Insert message into database
        chat.insert({name:name,message:message});
      }
      });
    });
    
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
  next();
});

app.use('/', appRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.render('index');
});

module.exports = app;
