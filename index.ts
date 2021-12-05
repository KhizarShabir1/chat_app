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

var alphas:WebSocket[] = []; 

webServer.on("connection", (w) =>{
    console.log("someone connected")
    w.on('message', (msg)=>{
        console.log("got message: ", msg.toString())
        alphas.push(w);
        //sending back the message to the client
        w.send(msg.toString())
        console.log("got message: ", msg.toString())

        console.log("got message: ", alphas.length.toString())
    })
})
        
     app.listen()