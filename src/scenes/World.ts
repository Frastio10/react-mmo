import Phaser from "phaser";
import WorldModel from "../models/WorldModel";
import Player from "../characters/Player";
import { createTilemap, generateBasicWorldArrays } from "../utils/world";
import { BLOCK_SIZE } from "../config/constant";

export default class World extends Phaser.Scene {
  localPlayer!: Player;
  blockLayer!: Phaser.Tilemaps.TilemapLayer | null;
  backgroundLayer!: Phaser.Tilemaps.TilemapLayer | null;
  worldMetadata!: WorldModel;

  cursor?: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super("world");
  }

  init(world: WorldModel) {
    console.log(world);
    this.worldMetadata = world;
  }

  create() {
    this.cursor = this.input.keyboard?.createCursorKeys();
    const bg = this.add.image(0, 0, this.worldMetadata.weatherType);
    bg.scale = 4;

    this.createMap();
    this.addLocalPlayer();
    this.attachCamera();

    if (this.blockLayer && this.backgroundLayer) {
      this.physics.add.collider(this.localPlayer, this.blockLayer);
    }

    this.input.on("pointerup", (pointer: any) =>
      this.removeTile(pointer.worldX, pointer.worldY),
    );
  }

  attachCamera() {
    this.cameras.main.startFollow(this.localPlayer, true);
    this.cameras.main.zoom = 1.2;
    this.cameras.main.setBounds(0, 0, 100 * BLOCK_SIZE, 70 * BLOCK_SIZE);
  }

  removeTile(worldX: number, worldY: number) {
    this.blockLayer?.removeTileAtWorldXY(worldX, worldY);
  }

  addLocalPlayer() {
    this.localPlayer = this.add.Player(100, 450, "dude");
  }

  createMap() {
    const { blockArr, bgArr } = generateBasicWorldArrays();
    const map = createTilemap(this, blockArr);
    const mapBg = createTilemap(this, bgArr);

    const tiles = map.addTilesetImage("mario-tiles");
    const tileBg = mapBg.addTilesetImage("mario-tiles");

    if (tiles && tileBg) {
      this.backgroundLayer = mapBg.createLayer(0, tileBg, 0, 0);
      this.blockLayer = map.createLayer(0, tiles, 0, 0);
      this.blockLayer?.setCollision([39]);
    }
  }

  update() {
    if (this.cursor) this.localPlayer.update(this.cursor);
  }
}
