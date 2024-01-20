const http = require("http");
const path = require("path");
const express = require("express");
const WebSocket = require("ws");
const randomstring = require("randomstring");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = 8081;

const STATIC_PATH = path.join(__dirname, "..", "public");
app.use(express.static(STATIC_PATH));

let players = [];
const activeNetID = [];

wss.on("connection", (clientSocket) => {
  clientSocket.isAlive = true;

  clientSocket.netID = randomstring.generate({
    length: 8,
    charset: "23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz",
  });

  console.log("Client Connected", clientSocket.netID);

  clientSocket.send(JSON.stringify({ ID: "INIT.PLAYERS", players }));

  clientSocket.on("message", (data) => {
    const packet = JSON.parse(data.toString());

    const movement = (movement) => {
      const chosen = players.find(
        (player) => packet.playerID === player.playerID,
      );

      //console.log(packet);

      chosen.posX = packet.posX;
      chosen.posY = packet.posY;

      wss.broadcast({
        ID: movement,
        netID: packet.netID,
        playerID: packet.playerID,
        posX: packet.posX,
        posY: packet.posY,
      });
    };

    switch (packet.ID) {
      case "ALERT":
        alert(packet.message);
        console.log(packet);

      case "PLAYER.JOIN":
        clientSocket.send(
          JSON.stringify({
            ID: "PLAYER.JOINED",
            netID: clientSocket.netID,
            playerID: packet.playerID,
            playerName: packet.playerName,
            posX: packet.posX,
            posY: packet.posY,
          }),
        );

        players.push({
          netID: clientSocket.netID,
          playerID: packet.playerID,
          playerName: packet.playerName,
          posX: packet.posX,
          posY: packet.posY,
        });

        wss.broadcast({
          ID: "PLAYER.JOIN",
          netID: clientSocket.netID,
          playerID: packet.playerID,
          playerName: packet.playerName,
          posX: packet.posX,
          posY: packet.posY,
        });
        break;

      case "NET.PONG":
        clientSocket.isAlive = true;
        break;

      case "PLAYER.CHAT":
        let playerText = packet.text;
        wss.broadcast({
          ID: "PLAYER.CHAT",
          playerName: packet.playerName,
          text: playerText,
        });
        break;

      case "PLAYER.MOVE_LEFT":
      case "PLAYER.MOVE_RIGHT":
      case "PLAYER.STOP":
      case "PLAYER.JUMP":
        movement(packet.ID);
    }
  });

  clientSocket.on("close", () => {
    wss.broadcast({
      ID: "PLAYER.LEAVE",
      netID: clientSocket.netID,
    });

    players = players.filter((player) => player.netID !== clientSocket.netID);
  });
});

wss.broadcast = function broadcast(msg) {
  const data = JSON.stringify(msg);
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};

const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) {
      players = players.filter((player) => player.netID !== ws.netID);
      return ws.terminate();
    }

    if (!activeNetID.includes(ws.netID)) activeNetID.push(ws.netID);

    ws.isAlive = false;
    ws.send(JSON.stringify({ ID: "NET.PING", netID: ws.netID }));
  });
}, 1500);

wss.on("close", function close() {
  clearInterval(interval);
});

server.listen(PORT, () => console.log("WebSocket is running on port " + PORT));
