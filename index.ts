import { count } from 'console';
import express from 'express';
import WebSocket from 'ws';

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello world');
});

const  webServer = new WebSocket.Server( {
    server: app.listen(PORT, () => {
                console.log(`Express with Typescript! http://localhost:${PORT}`);
            }),
    host: "localhost",
    path: "/"
})

var connections:WebSocket[] = []; 
var names:String[] = [];
var names:String[] = [];
var locales:String[] = [];

webServer.on("connection", (w) =>{
    console.log("someone connected")
    w.on('message', (msg)=>{
        
        var splittedMessage = msg.toString().split(":")
        if (splittedMessage[0]== "connection"){
            connections.push(w);
            names.push(splittedMessage[1])
            locales.push(splittedMessage[2])
            console.log("got connection: ", msg.toString())
            console.log("Number of connection now: ", connections.length.toString())
        }
        if (splittedMessage[0]== "message"){

            console.log("got message: ", msg.toString())
            for (let i in connections) {
                console.log("sending message to:  ", splittedMessage[1] )
                connections[i].send(splittedMessage[1] + ":" + splittedMessage[2])
              }
              
        }
        


        
    })
})
        
     app.listen()