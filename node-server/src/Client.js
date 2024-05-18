const Packet = require("./Packet");
const { PLAYER_PACKET_SCOPE, NET_PACKET_SCOPE } = require("./constants");

module.exports = class Client {
  constructor(socket, server) {
    this.socket = socket;
    this.server = server;
    this.user = {
      id: null,
      name: null,
      posX: null,
      posY: null,
    };

    this.socket.on("message", this.onMessage.bind(this));
  }

  acceptJoin() {
    // console.log(this.user);
    this.socket.sendF("PLAYER.JOINED", {
      netID: this.user.id,
      playerID: this.user.id,
      playerName: this.user.name,
      posX: this.user.posX,
      posY: this.user.posY,
    });

    this.server.broadcast(
      new Packet().create(PLAYER_PACKET_SCOPE, "JOINED_ANOTHER", {
        netID: this.user.id,
        playerID: this.user.id,
        playerName: this.user.name,
        posX: this.user.posX,
        posY: this.user.posY,
      }),
      this.socket,
    );
  }

  onMessage(raw) {
    const packet = new Packet(raw);
    switch (packet.getScope()) {
      case PLAYER_PACKET_SCOPE:
        // console.log(packet.ID, packet.data.playerID);
        this.handlePlayerPacket(packet);
        break;
      case NET_PACKET_SCOPE:
        this.handleNetPacket(packet);
    }
  }

  handleNetPacket(packet) {
    switch (packet.getEvent()) {
      case "PONG":
        this.socket.isAlive = true;
        // this.user.posX = packet.data.posX;
        // this.user.posY = packet.data.posY;
        break;
    }
  }

  handlePlayerPacket(packet) {
    switch (packet.getEvent()) {
      case "CHAT":
        this.handleChat(packet);
        break;

      // case "MOVE_LEFT":
      // case "MOVE_RIGHT":
      case "MOVE":
      case "JUMP":
        this.handleMovement(packet);
        break;
    }
  }

  echoBroadcast(packet) {
    this.server.broadcast(packet.json());
  }

  handleChat(packet) {
    // some profanity checking idk
    // console.log(packet.ID, packet.data);
    const text = packet.data.text;
    const profanity = ["fuck", "bitch"];
    const profanityRegex = new RegExp(profanity.join("|"), "gi");
    const censoredText = text.replace(profanityRegex, (match) =>
      "*".repeat(match.length),
    );

    packet.data.text = censoredText;

    this.echoBroadcast(packet);
  }

  handleMovement(packet) {
    const playerClient = this.server.clients.get(packet.data.playerID);
    playerClient.user.posX = packet.data.posX;
    playerClient.user.posY = packet.data.posY;

    this.server.broadcast(packet.json(), this.socket);
  }

  alert(message) {
    this.socket.sendF("ALERT", { message });
  }
};
