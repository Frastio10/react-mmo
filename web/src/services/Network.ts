import { EventKey, eventManager } from "../events/EventManager";
import Socket from "../net/Socket";
import { log } from "../utils";
import { PacketKeys, createJoinPacket, createPongPacket } from "./Packets";

type Method = (data: any) => void;
const networkEvents = new Map<PacketKeys, Method | undefined>();

type NetworkEventDecorator = (
  target: any,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<Method>,
) => void;

function NetworkEvent(eventKey: PacketKeys): NetworkEventDecorator {
  return function (
    // @ts-ignore
    target: any,
    // @ts-ignore
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<Method>,
  ) {
    const originalMethod = descriptor.value;

    if (originalMethod) networkEvents.set(eventKey, originalMethod);

    return descriptor;
  };
}

export default class Network {
  ws: Socket;
  netID: null | string;
  status: number;
  constructor() {
    this.ws = new Socket("ws://localhost:8081");
    this.netID = null;
    this.status = 0;
    this.attachListeners();
  }

  attachListeners() {
    this.ws.onJson = this.handleIncomingMessage.bind(this);
    this.ws.onConnected = this.handleConnectedNetwork.bind(this);

    eventManager.on(EventKey.REQUEST_JOIN, this.sendJoinPlayer.bind(this));
  }

  handleIncomingMessage(json: any) {
    const networkKey = json.ID as PacketKeys;
    const handler = networkEvents.get(networkKey);

    if (handler) handler.call(this, json);

    // switch (json.ID) {
    //   case PacketKeys.NET_REGISTER:
    //     this.onRegisterPacket(json);
    //     break;

    //   case PacketKeys.JOIN_REQUEST:
    //     if (json.netID !== this.netID) this.onRemotePlayerJoined(json);
    //     break;

    //   case PacketKeys.NET_PING:
    //     this.onPingPacket(json);
    //     break;

    //   case PacketKeys.ANOTHER_PLAYER_JOINED:
    //     this.onOtherPlayerJoined(json);
    //     break;

    //   case PacketKeys.ANOTHER_PLAYER_UPDATED:
    //     this.onRemotePlayerUpdated(json);
    //     break;

    //   case PacketKeys.INIT_PLAYERS:
    //     this.onInitPlayers(json);
    //     break;
    // }
  }

  handleConnectedNetwork() {
    console.log("Connected to network");
  }

  @NetworkEvent(PacketKeys.INIT_PLAYERS)
  onInitPlayers(data: any) {
    eventManager.emit(EventKey.INIT_PLAYERS, data);
  }

  @NetworkEvent(PacketKeys.ANOTHER_PLAYER_JOINED)
  onOtherPlayerJoined(data: any) {
    eventManager.emit(EventKey.ANOTHER_PLAYER_JOINED, data);
  }

  @NetworkEvent(PacketKeys.ANOTHER_PLAYER_UPDATED)
  onRemotePlayerUpdated(data: any) {
    eventManager.emit(EventKey.ANOTHER_PLAYER_UPDATED, data);
  }

  @NetworkEvent(PacketKeys.NET_REGISTER)
  onRegisterPacket(data: any) {
    this.netID = data.netID;
    this.status = 1;

    eventManager.emit(EventKey.NET_REGISTERED, this.netID);
  }

  @NetworkEvent(PacketKeys.NET_PING)
  onPingPacket(_: any) {
    if (!this.netID) return log("No netID.");
    this.ws.sendJSON(createPongPacket(this.netID));
  }

  @NetworkEvent(PacketKeys.ANOTHER_PLAYER_JOINED)
  onRemotePlayerJoined(data: any) {
    eventManager.emit(EventKey.ANOTHER_PLAYER_JOINED, data);
  }

  sendJoinPlayer(data: any) {
    if (!this.netID) return log("No netID.");

    this.ws.sendJSON(
      createJoinPacket({
        netID: this.netID,
        playerID: this.netID,
        name: data.name,
        x: data.x,
        y: data.y,
      }),
    );
  }

  updatePlayer(x: number, y: number) {
    this.ws.sendJSON({
      ID: "PLAYER.MOVE",
      playerID: this.netID,
      netID: this.netID,
      posX: x,
      posY: y,
    });
  }
}
