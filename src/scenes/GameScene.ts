import Phaser from "phaser";
import { createAnims } from "../anims/CharacterAnims";
import "../characters/Player";
import { BLOCK_SIZE } from "../config/constant";

export default class GameScene extends Phaser.Scene {
  player!: Phaser.Physics.Arcade.Sprite;
  cursor?: Phaser.Types.Input.Keyboard.CursorKeys;
  stars!: Phaser.Physics.Arcade.Group;
  mapLayer!: Phaser.Tilemaps.TilemapLayer | null;

  blockLayer!: Phaser.Tilemaps.TilemapLayer | null;
  constructor() {
    super("game");
  }

  createMap() {
    const world = [];
    const worldBg = [];

    for (let i = 0; i < 65; i++) {
      const array = Array(100).fill(null);
      world.push(array);
    }

    for (let i = 0; i < 5; i++) {
      const array = Array(100).fill(39);
      world.push(array);
    }

    for (let i = 0; i < 63; i++) {
      const array = Array(100).fill(null);
      worldBg.push(array);
    }

    for (let i = 0; i < 7; i++) {
      const array = Array(100).fill(33);
      worldBg.push(array);
    }

    const map = this.make.tilemap({
      data: world,
      tileWidth: 16,
      tileHeight: 16,
    });

    const mapBg = this.make.tilemap({
      data: worldBg,
      tileWidth: 16,
      tileHeight: 16,
    });

    const tiles = map.addTilesetImage("mario-tiles");
    const tileBg = mapBg.addTilesetImage("mario-tiles");

    if (tiles && tileBg) {
      this.blockLayer = mapBg.createLayer(0, tileBg, 0, 0);
      this.mapLayer = map.createLayer(0, tiles, 0, 0);
      this.mapLayer?.setCollision([39]);
    }
  }

  create() {
    const bg = this.add.image(0, 0, "sky");
    bg.scale = 4
   
    this.cursor = this.input.keyboard?.createCursorKeys();

    createAnims(this.anims);

    this.createMap();

    this.player = this.add.Player(100, 450, "dude");

    if (this.mapLayer) {
      this.physics.add.collider(this.player, this.mapLayer);
    }

    this.attachCamera();

    this.input.on("pointerup", (pointer: any) => {
      const tile = this.mapLayer?.getTileAtWorldXY(
        pointer.worldX,
        pointer.worldY,
      );

      console.log(tile);
      this.mapLayer?.removeTileAtWorldXY(pointer.worldX, pointer.worldY);
    });
  }

  attachCamera() {
    this.cameras.main.startFollow(this.player, true);
    this.cameras.main.zoom = 1.2;
    this.cameras.main.setBounds(0, 0, 100 * BLOCK_SIZE, 70 * BLOCK_SIZE);
  }

  update() {
    this.player.update(this.cursor);
  }
}
