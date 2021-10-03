import { Injectable } from "@angular/core";
import * as io from 'socket.io-client';
import {Observable} from 'rxjs/Observable';




@Injectable()


export class ChatService{

    private socket = io('http://localhost:3000');
    private Piesocket=require("piesocket-nodejs");

    piesocket=new this.Piesocket({
        clusterId:'free3',
        apiKey:'K35x7MwfSJ5TQRuYgjJExY7JyDy4BlvpznV4QOWy',
        secret:'R5bbwkQbLf9nMRhFYlHdom73KtDfttg1'
    });

  
    joinRoom(data)
    {
        this.piesocket.publish('join',data);
    }

    newUserJoined()
    {
        let observable = new Observable<{user:String, message:String}>(observer=>{
            this.socket.on('new user joined', (data)=>{
                observer.next(data);
            });
            return () => {this.socket.disconnect();}
        });

        return observable;
    }

    leaveRoom(data){
        this.piesocket.publish('leave',data);
    }

    userLeftRoom(){
        let observable = new Observable<{user:String, message:String}>(observer=>{
            this.socket.on('left room', (data)=>{
                observer.next(data);
            });
            return () => {this.socket.disconnect();}
        });

        return observable;
    }

    sendMessage(data)
    {
        this.piesocket.publish('message',data);
    }

    newMessageReceived(){
        let observable = new Observable<{user:String, message:String}>(observer=>{
            this.socket.on('new message', (data)=>{
                observer.next(data);
            });
            return () => {this.socket.disconnect();}
        });

        return observable;
    }
}