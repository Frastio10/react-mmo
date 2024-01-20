import { EventKey, eventManager } from "../events/EventManager";
import Socket from "../net/Socket";
import { log } from "../utils";
import { PacketKeys, createJoinPacket, createPongPacket } from "./Packets";

export default class Network {
  ws: Socket;
  netID: null | string;
  status: number;
  constructor() {
    this.ws = new Socket("ws://192.168.1.20:8081");
    this.netID = null;
    this.status = 0;
    this.attachListeners();
  }

  attachListeners() {
    this.ws.onJson = this.handleIncomingMessage.bind(this);
    this.ws.onConnected = this.handleConnectedNetwork.bind(this);

    eventManager.on(EventKey.REQUEST_JOIN, this.sendJoinPlayer.bind(this));
  }

  handleConnectedNetwork() {
    console.log("hm");
  }

  handleIncomingMessage(json: any) {
    switch (json.ID) {
      case PacketKeys.NET_REGISTER:
        this.onRegisterPacket(json);
        break;
      case PacketKeys.JOIN_REQUEST:
        if (json.netID !== this.netID) this.onRemotePlayerJoined(json);
        break;
      case PacketKeys.NET_PING:
        this.onPingPacket();
        break;
    }
  }

  onPingPacket() {
    if (!this.netID) return log("No netID.");
    this.ws.sendJSON(createPongPacket(this.netID));
  }

  onRegisterPacket(data: any) {
    this.netID = data.netID;
    this.status = 1;

    eventManager.emit(EventKey.NET_REGISTERED, this.netID);
    console.log(this.netID);
  }

  onRemotePlayerJoined(data: any) {
    console.log("other:", data);
  }

  sendJoinPlayer(data: any) {
    if (!this.netID) return log("No netID.");

    this.ws.sendJSON(
      createJoinPacket({
        playerId: this.netID,
        playerName: data.playerName,
        posX: data.x,
        posY: data.y,
      }),
    );
  }
}
