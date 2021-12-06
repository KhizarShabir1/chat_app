import { count } from "console";
import express from "express";
import WebSocket from "ws";
import deepl from "deepl";
import { text } from "node:stream/consumers";

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Hello world");
});

const webServer = new WebSocket.Server({
  server: app.listen(PORT, () => {
    console.log(`Express with Typescript! http://localhost:${PORT}`);
  }),
  host: "localhost",
  path: "/",
});

// TODO: we can use an interface or type alias here to make a structure for the name and connection insted
// of separate arrays for each message type
var connections: WebSocket[] = [];
var names: String[] = [];
var locales: deepl.DeeplLanguages[] = ["EN", "DE", "ES"];
let assignedlocales: number[] = [];

function returnLocale(lang: number): deepl.DeeplLanguages {
  if (lang == 0) {
    return locales[0];
  } else if (lang == 1) {
    return locales[1];
  } else if (lang == 2) {
    return locales[2];
  }

  return locales[0];
}

webServer.on("connection", (w) => {
  console.log("someone connected");
  w.on("message", (msg) => {
    var splittedMessage = msg.toString().split(":");
    if (splittedMessage[0] == "connection") {
      connections.push(w);
      names.push(splittedMessage[1]);

      //assigning locales for differentclients
      if (splittedMessage[2] == "EN") {
        assignedlocales.push(0);
      } else if (splittedMessage[2] == "DE") {
        assignedlocales.push(1);
      } else if (splittedMessage[2] == "ES") {
        assignedlocales.push(2);
      }

      console.log("got connection: ", msg.toString());
      console.log("Number of connection now: ", connections.length.toString());
    }
    if (splittedMessage[0] == "message") {
      console.log("got message: ", msg.toString());

      for (let i = 0; i < connections.length; i++) {
        console.log("sending message to:  ", assignedlocales[i]);

        deepl({
          free_api: true,
          text: splittedMessage[2],
          target_lang: returnLocale(assignedlocales[i]),
          auth_key: "33b07e7f-4beb-8624-01fc-95eaf3043c29:fx",
          // All optional parameters available in the official documentation can be defined here as well.
        })
          .then((result) => {
            connections[i].send(
              splittedMessage[1] + ": " + result.data.translations[0].text
            );
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
  });
});

app.listen();
