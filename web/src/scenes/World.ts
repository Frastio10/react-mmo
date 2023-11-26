import Phaser from "phaser";
import WorldModel from "../models/Worlds/WorldModel";
import Player from "../characters/Player";

import {
  BLOCK_SIZE,
  DEFAULT_AIR_ID,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from "../config/constant";
import { BLOCK_COLLISION_EXCLUSION } from "../config/worldConfigs";
import { Keyboard, NavKeys } from "../types/KeyboardState";
import { setJoinWorld } from "../stores/WorldStore";
import store from "../stores";
import { initiateWorld } from "../stores/playerStore";
import { log } from "../utils";
import Block from "../models/Worlds/Block";
import ResourceManager from "../models/ResourceManager";
import WorldGenerator from "../utils/WorldGenerator";
import { BlockTypes } from "../types/Enums";

export default class World extends Phaser.Scene {
  localPlayer!: Player;
  blockLayer!: Phaser.Tilemaps.TilemapLayer | null;
  backgroundLayer!: Phaser.Tilemaps.TilemapLayer | null;
  worldMetadata!: WorldModel;

  blockInstances!: Block[][];
  backgroundInstances!: Block[][];

  cursor?: Phaser.Types.Input.Keyboard.CursorKeys;
  cursors!: NavKeys;

  resourceManager!: ResourceManager;

  constructor() {
    super("world");
  }

  init(world: WorldModel) {
    this.worldMetadata = world;
  }

  registerKeys() {
    this.cursors = {
      ...(this.input.keyboard!.addKeys("W,S,A,D,R") as Keyboard),
      ...this.input.keyboard!.createCursorKeys(),
    };
  }

  create() {
    this.cursor = this.input.keyboard?.createCursorKeys();
    this.registerKeys();

    const bg = this.add.image(0, 0, this.worldMetadata.weatherType);
    bg.scale = 4;

    this.createMap();
    this.addLocalPlayer();
    this.attachCamera();

    this.add
      .text(100, 60, this.worldMetadata.name, {
        fontFamily: "Arial",
        fontSize: 16,
        color: "#ffffff",
      })
      .setScrollFactor(0);

    store.dispatch(initiateWorld(this));
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

  removeBlockAt(tileX: number, tileY: number) {
    if (!this.canHitBlock(tileX, tileY)) return log("Cannot hit the block.");
    const block = this.getBlockAt(tileX, tileY);

    return this.replaceWithAir(this.blockLayer!, block.tile);
  }

  removeTile(worldX: number, worldY: number) {
    const blockTile = this.blockLayer?.getTileAtWorldXY(worldX, worldY);
    const bgTile = this.backgroundLayer?.getTileAtWorldXY(worldX, worldY);

    if (!blockTile || !bgTile) {
      return log("Removing tile failed, Tile is invalid or not found.");
    }

    if (blockTile && blockTile.index !== DEFAULT_AIR_ID) {
      return this.replaceWithAir(this.blockLayer!, blockTile);
    }

    if (bgTile) return this.replaceWithAir(this.backgroundLayer!, bgTile);
  }

  getBlockLayerInstanceAt(
    layer: Phaser.Tilemaps.TilemapLayer,
    tileInstances: Block[][],
    worldX: number,
    worldY: number,
  ) {
    const tile = layer?.getTileAt(worldX, worldY)!;
    const tileInstance = tileInstances[tile.y][tile.x];

    return tileInstance;
  }

  getBlockAt(tileX: number, tileY: number) {
    return this.blockInstances[tileY][tileX];
  }

  getBackgroundAt(tileX: number, tileY: number) {
    return this.backgroundInstances[tileY][tileX];
  }

  replaceWithAir(
    layer: Phaser.Tilemaps.TilemapLayer,
    tile: Phaser.Tilemaps.Tile,
  ) {
    const block = ResourceManager.getBlockData(tile.index);
    const airData = ResourceManager.getBlockData(DEFAULT_AIR_ID);
    if (!airData) return log("Failed to replace. Air data is not found.");

    const newTile = layer.putTileAt(DEFAULT_AIR_ID, tile.x, tile.y);
    const airBlock = new Block(
      this,
      new Phaser.Math.Vector2(tile.x, tile.y),
      newTile,
      airData,
    );

    if (block?.type === BlockTypes.BLOCK) {
      this.setBlock(airBlock);
      console.log("replaced setted");
    } else if (block?.type === BlockTypes.BACKGROUND) {
      this.setBackground(airBlock);
    }

    return newTile;
  }

  canHitBlock(tileX: number, tileY: number) {
    const block = this.getBlockAt(tileX, tileY);
    if (block.metadata.isBreakable) return true;
  }

  hitBlock(tileX: number, tileY: number) {
    if (!this.canHitBlock(tileX, tileY)) return;
    const block = this.getBlockAt(tileX, tileY);
    block.hit();
  }

  setBlock(block: Block) {
    this.blockInstances[block.position.y][block.position.x] = block;
    return block;
  }

  setBlockAt(tileX: number, tileY: number, block: Block) {
    this.blockInstances[tileY][tileX] = block;
    return block;
  }

  canHitBackground(tileX: number, tileY: number) {
    const background = this.getBackgroundAt(tileX, tileY);
    if (background.metadata.isBreakable) return true;
  }

  hitBackground(tileX: number, tileY: number) {
    if (!this.canHitBackground(tileX, tileY)) return;
    const block = this.getBackgroundAt(tileX, tileY);
    block.hit();
  }

  removeBackgroundAt(tileX: number, tileY: number) {
    if (!this.canHitBackground(tileX, tileY))
      return log("Cannot hit the block.");
    const block = this.getBackgroundAt(tileX, tileY);

    return this.replaceWithAir(this.backgroundLayer!, block.tile);
  }

  setBackground(block: Block) {
    this.backgroundInstances[block.position.y][block.position.x] = block;
    return block;
  }

  placeTile(itemId: number, type: BlockTypes, worldX: number, worldY: number) {
    const tileCoords = this.blockLayer?.worldToTileXY(worldX, worldY);
    const tile = this.blockLayer?.getTileAtWorldXY(worldX, worldY);

    const layer =
      type === BlockTypes.BLOCK ? this.blockLayer : this.backgroundLayer;

    if (tile && tile?.index === DEFAULT_AIR_ID && tileCoords) {
      const newTile = layer?.putTileAt(itemId, tileCoords.x, tileCoords.y);
      const coord = new Phaser.Math.Vector2(tileCoords.x, tileCoords.y);

      if (!newTile) {
        return log(
          `Placing tile failed, tile at ${tileCoords.x},${tileCoords.y} is invalid`,
        );
      }

      const block = new Block(
        this,
        coord,
        newTile,
        ResourceManager.getBlockData(itemId)!,
      );

      if (type === BlockTypes.BLOCK) {
        layer?.setCollisionByExclusion(BLOCK_COLLISION_EXCLUSION);
        this.setBlock(block);
      }

      return true;
    }

    return false;
  }

  addLocalPlayer() {
    this.localPlayer = this.add.Player(100, 450, "dude");
    this.physics.add.collider(this.localPlayer, this.blockLayer!);

    store.dispatch(setJoinWorld(true));
  }

  createMap() {
    const map = WorldGenerator.createTilemap(this, this.worldMetadata.blockArr);
    const mapBg = WorldGenerator.createTilemap(
      this,
      this.worldMetadata.backgroundArr,
    );

    const tiles = map.addTilesetImage("gt-tiles_1");
    const tileBg = mapBg.addTilesetImage("gt-tiles_1");

    if (!tiles || !tileBg)
      return log("Adding tileset failed. Tiles is invalid");

    this.backgroundLayer = mapBg.createLayer(0, tileBg, 0, 0);
    this.blockLayer = map.createLayer(0, tiles, 0, 0);
    this.blockLayer?.setCollisionByExclusion(BLOCK_COLLISION_EXCLUSION);

    this.blockInstances = this.worldMetadata.blockArr.map((rows, parentIdx) => {
      return rows.map((block, idx) => {
        const blockData = ResourceManager.getBlockData(block)!;
        const cord = new Phaser.Math.Vector2(idx, parentIdx);
        const tile = this.blockLayer?.getTileAt(idx, parentIdx)!;

        if (!blockData) {
          return new Block(
            this,
            cord,
            tile,
            ResourceManager.getBlockData(DEFAULT_AIR_ID)!,
          );
        }

        return new Block(this, cord, tile, blockData);
      });
    });

    this.backgroundInstances = this.worldMetadata.backgroundArr.map(
      (rows, parentIdx) => {
        return rows.map((block, idx) => {
          const blockData = ResourceManager.getBlockData(block)!; // add handler if invalid id
          const cord = new Phaser.Math.Vector2(idx, parentIdx);
          const tile = this.blockLayer?.getTileAt(idx, parentIdx)!;
          if (!blockData) {
            return new Block(
              this,
              cord,
              tile,
              ResourceManager.getBlockData(DEFAULT_AIR_ID)!,
            );
          }

          return new Block(this, cord, tile, blockData);
        });
      },
    );
  }

  update() {
    if (this.cursors) this.localPlayer.update(this.cursors);
  }
}
