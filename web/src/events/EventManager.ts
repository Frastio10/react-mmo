import Phaser from "phaser";

export const eventManager = new Phaser.Events.EventEmitter();

export enum EventKey {
  TILE_UPDATE = "TILE_UPDATE",
  REQUEST_JOIN = "REQUEST_JOIN",
  NET_REGISTERED = "NET_REGISTERED",
}
