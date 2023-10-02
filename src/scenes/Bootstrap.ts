import Phaser from "phaser";
import { createAnims } from "../anims/CharacterAnims";
import "../characters/Player";
import WorldModel from "../models/WorldModel";

export default class Bootstrap extends Phaser.Scene {
  player!: Phaser.Physics.Arcade.Sprite;
  cursor?: Phaser.Types.Input.Keyboard.CursorKeys;
  stars!: Phaser.Physics.Arcade.Group;
  mapLayer!: Phaser.Tilemaps.TilemapLayer | null;

  blockLayer!: Phaser.Tilemaps.TilemapLayer | null;
  constructor() {
    super("game");
  }

  create() {
    this.cursor = this.input.keyboard?.createCursorKeys();

    createAnims(this.anims);
    this.scene.launch("world", new WorldModel());
  }
}
