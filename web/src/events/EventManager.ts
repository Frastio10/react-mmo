import Phaser from "phaser"

export const eventManager = new Phaser.Events.EventEmitter()

export enum EventKey {
  TILE_UPDATE = 'TILE_UPDATE'
}
