import Phaser from "phaser";

export const eventManager = new Phaser.Events.EventEmitter();

export enum EventKey {
  TILE_UPDATE = "TILE_UPDATE",
  REQUEST_JOIN = "REQUEST_JOIN",
  NET_REGISTERED = "NET_REGISTERED",

  ANOTHER_PLAYER_JOINED = "ANOTHER_PLAYER_JOINED",
  ANOTHER_PLAYER_UPDATED = "ANOTHER_PLAYER_UPDATED",
  INIT_PLAYERS = "INIT_PLAYERS",
}
