import Phaser from "phaser";
import { createAnims } from "../anims/CharacterAnims";
import "../characters/LocalPlayer";
import WorldModel from "../models/Worlds/WorldModel";
import WorldGenerator from "../utils/WorldGenerator";

export default class Bootstrap extends Phaser.Scene {
  cursor?: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super("game");
  }

  create() {
    this.cursor = this.input.keyboard?.createCursorKeys();

    createAnims(this.anims);

    const world = new WorldModel();
    const { blockArr, bgArr } = WorldGenerator.generateBasicWorldArrays();
    world.blockArr = blockArr;
    world.backgroundArr = bgArr;
    world.id = "TEST";
    world.name = "TEST_WORLD";

    this.scene.launch("world", world);
  }
}
