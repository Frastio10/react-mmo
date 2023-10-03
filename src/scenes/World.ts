import Phaser from "phaser";
import WorldModel from "../models/WorldModel";
import Player from "../characters/Player";
import { createTilemap, generateBasicWorldArrays } from "../utils/world";
import {
  BLOCK_SIZE,
  DEFAULT_AIR_ID,
  DEFAULT_GROUND_BLOCK_ID,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from "../config/constant";
import { BLOCK_COLLISION_EXCLUSION } from "../config/worldConfigs";

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
    this.worldMetadata = world;
  }

  create() {
    this.cursor = this.input.keyboard?.createCursorKeys();
    const bg = this.add.image(0, 0, this.worldMetadata.weatherType);
    bg.scale = 4;

    this.createMap();
    this.addLocalPlayer();
    this.attachCamera();

    if (this.blockLayer) {
      this.physics.add.collider(this.localPlayer, this.blockLayer);
    }
    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (pointer.rightButtonDown()) {
        this.placeTile(pointer.worldX, pointer.worldY);
      } else {
        this.removeTile(pointer.worldX, pointer.worldY);
      }
    });
  }

  attachCamera() {
    this.cameras.main.startFollow(this.localPlayer, true);
    this.cameras.main.zoom = 1.2;
    this.cameras.main.setBounds(
      0,
      0,
      WORLD_WIDTH * BLOCK_SIZE,
      WORLD_HEIGHT * BLOCK_SIZE,
    );
  }

  removeTile(worldX: number, worldY: number) {
    const blockTile = this.blockLayer?.getTileAtWorldXY(worldX, worldY);
    const bgTile = this.backgroundLayer?.getTileAtWorldXY(worldX, worldY);

    if (blockTile && blockTile.index !== DEFAULT_AIR_ID) {
      return this.replaceWithAir(this.blockLayer!, blockTile);
    }

    if (bgTile) return this.replaceWithAir(this.backgroundLayer!, bgTile);
  }

  replaceWithAir(
    layer: Phaser.Tilemaps.TilemapLayer,
    tile: Phaser.Tilemaps.Tile,
  ) {
    return layer.putTileAt(DEFAULT_AIR_ID, tile.x, tile.y);
  }

  placeTile(worldX: number, worldY: number) {
    const tileCoords = this.blockLayer?.worldToTileXY(worldX, worldY);
    const tile = this.blockLayer?.getTileAtWorldXY(worldX, worldY);

    if (tile && tile?.index === DEFAULT_AIR_ID && tileCoords) {
      this.blockLayer?.putTileAt(
        DEFAULT_GROUND_BLOCK_ID,
        tileCoords.x,
        tileCoords.y,
      );

      return;
    }
  }

  addLocalPlayer() {
    this.localPlayer = this.add.Player(100, 450, "dude");
  }

  createMap() {
    const { blockArr, bgArr } = generateBasicWorldArrays();
    const map = createTilemap(this, blockArr);
    const mapBg = createTilemap(this, bgArr);

    const tiles = map.addTilesetImage("gt-tiles_1");
    const tileBg = mapBg.addTilesetImage("gt-tiles_1");

    if (tiles && tileBg) {
      this.backgroundLayer = mapBg.createLayer(0, tileBg, 0, 0);
      this.blockLayer = map.createLayer(0, tiles, 0, 0);
      this.blockLayer?.setCollisionByExclusion(BLOCK_COLLISION_EXCLUSION);
    }
  }

  update() {
    if (this.cursor) this.localPlayer.update(this.cursor);
  }
}
