const express = require("express");
const WebSocket = require("ws");
const http = require("http");
const path = require("path");
const Client = require("./Client");
const ExtendedSocket = require("./Socket");
const randomstring = require("randomstring");

const PORT = 8081;
const STATIC_PATH = path.join(__dirname, "..", "public");

class Server {
  constructor() {
    this.expressApp = express();
    const server = http.createServer(this.expressApp);
    this.wss = new WebSocket.Server({ server });

    this.clients = new Map();
    // this.players = [];

    this._handleHTTP(server);

    const pingInterval = setInterval(() => {
      this.checkClientConnections();
    }, 1500);

    this.wss.on("connection", this._handleWS.bind(this));
    this.wss.on("close", () => clearInterval(pingInterval));
  }

  _handleHTTP(server) {
    // this.expressApp.use(express.static(STATIC_PATH));

    server.listen(PORT, () =>
      console.log("WebSocket is running on port " + PORT),
    );
  }

  _handleWS(socket) {
    const extSock = new ExtendedSocket(socket);
    const players = [];
    if (this.clients.size) {
      for (let [_, value] of this.clients) {
        // console.log(value.user);
        players.push({
          netID: value.user.id,
          playerID: value.user.id,
          playerName: value.user.name,
          posX: value.user.posX,
          posY: value.user.posY,
        });
      }
    }

    const netID = randomstring.generate({
      length: 8,
      charset: "23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz",
    });

    console.log("playerlist", players);

    extSock.sendF("INIT.PLAYERS", { players });
    extSock.sendF("NET.REGISTER", { netID });

    extSock.on("close", () => {
      this.broadcast({
        ID: "PLAYER.LEAVE",
        netID: extSock.netID,
      });
      this.clients.delete(extSock.netID);
    });

    extSock.on("message", (rawData) => {
      const packet = JSON.parse(rawData);
      if (packet.ID === "PLAYER.JOIN") {
        const isValidConnection = this.checkIsAlreadyConnected(
          extSock,
          packet.playerID,
        );
        if (!isValidConnection) {
          extSock.sendF("ALERT", {
            message:
              "Seems like you have already openned another tab, please close it and refresh",
            action: "refresh",
          });
          extSock.terminate();
          return;
        }

        this.createClient(extSock, packet);
      }
    });
  }

  createClient(extSock, joinPacket) {
    extSock.isAlive = true;
    extSock.netID = joinPacket.netID;
    const client = new Client(extSock, this);
    client.user = {
      id: joinPacket.playerID,
      name: joinPacket.playerName,
      posX: joinPacket.posX,
      posY: joinPacket.posY,
    };

    this.clients.set(joinPacket.playerID, client);
    client.acceptJoin();
    console.log("accepted", client);
    // client.onMessage(joinPacket);
  }

  checkIsAlreadyConnected(playerId) {
    const client = this.clients.get(playerId);
    if (client && client.socket.isAlive) {
      return false;
    }

    return true;
  }

  checkClientConnections() {
    for (let [_, client] of this.clients) {
      if (!client.socket.isAlive) {
        console.log(client.socket.netID, " is terminated");
        client.socket.terminate();
        this.broadcast({
          ID: "PLAYER.LEAVE",
          netID: client.socket.netID,
        });

        this.clients.delete(client.socket.netID);

        return;
      }

      client.socket.isAlive = false;
      client.socket.ping(client.user.id);
    }
  }

  broadcast(json, sender) {
    for (let [_, client] of this.clients) {
      if (sender !== undefined && sender === client.socket) continue; // Skip sending to the sender
      client.socket.json(json);
    }
  }
}

new Server();
