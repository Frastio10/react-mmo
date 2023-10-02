import Phaser from "phaser";
import WorldModel from "../models/WorldModel";

export default class World extends Phaser.Scene {
  constructor() {
    super("world");
  }

  init(world: WorldModel) {
    console.log(world);
  }
}
