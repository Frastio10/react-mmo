import Phaser from "phaser";
import WorldModel from "../models/Worlds/WorldModel";
import "../characters/LocalPlayer";
import "../characters/RemotePlayer";
import LocalPlayer from "../characters/LocalPlayer";

import {
  BLOCK_SIZE,
  DEFAULT_AIR_ID,
  MAX_PLAYER_RANGE,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from "../config/constant";
import { BLOCK_COLLISION_EXCLUSION } from "../config/worldConfigs";
import { Keyboard, NavKeys } from "../types/KeyboardState";
import { setJoinWorld } from "../stores/WorldStore";
import store from "../stores";
import { initiateWorld } from "../stores/playerStore";
import { hackerAlert, log } from "../utils";
import Block from "../models/Worlds/Block";
import ResourceManager from "../models/ResourceManager";
import WorldGenerator from "../utils/WorldGenerator";
import { BlockTypes } from "../types/Enums";
import MathHelper from "../utils/MathHelper";
import { EventKey, eventManager } from "../events/EventManager";
import RemotePlayer from "../characters/RemotePlayer";
import Network from "../services/Network";

export default class World extends Phaser.Scene {
  localPlayer!: LocalPlayer;
  remotePlayers!: RemotePlayer[];
  blockLayer!: Phaser.Tilemaps.TilemapLayer | null;
  backgroundLayer!: Phaser.Tilemaps.TilemapLayer | null;
  worldMetadata!: WorldModel;

  blockInstances!: Block[][];
  backgroundInstances!: Block[][];

  cursor?: Phaser.Types.Input.Keyboard.CursorKeys;
  cursors!: NavKeys;

  resourceManager!: ResourceManager;
  network!: Network;

  constructor() {
    super("world");
  }

  init({ world, network }: { world: WorldModel; network: Network }) {
    this.worldMetadata = world;
    this.network = network;
  }

  registerKeys() {
    this.cursors = {
      ...(this.input.keyboard!.addKeys("W,S,A,D,R") as Keyboard),
      ...this.input.keyboard!.createCursorKeys(),
    };
  }

  create() {
    this.cursor = this.input.keyboard?.createCursorKeys();
    this.remotePlayers = [];
    this.registerKeys();

    const bg = this.add.image(0, 0, this.worldMetadata.weatherType);
    bg.scale = 4;

    this.createMap();
    this.attachListeners();

    this.add
      .text(100, 60, this.worldMetadata.name, {
        fontFamily: "Arial",
        fontSize: 16,
        color: "#ffffff",
      })
      .setScrollFactor(0);

    // this.updateLayerCollision(this.blockLayer!);
    // this.updateCollisions();
    store.dispatch(initiateWorld(this));
  }

  onNetworkRegistered() {
    this.addLocalPlayer();
    this.attachCamera();
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
    } else if (block?.type === BlockTypes.BACKGROUND) {
      this.setBackground(airBlock);
    }

    // this.updateLayerCollision(this.blockLayer!);
    eventManager.emit(EventKey.TILE_UPDATE, airBlock);
    return newTile;
  }

  canHitBlock(tileX: number, tileY: number) {
    const block = this.getBlockAt(tileX, tileY);
    if (block.metadata.isBreakable && this.checkUpdateTileRange(tileX, tileY))
      return true;

    return false;
  }

  hitBlock(tileX: number, tileY: number) {
    if (!this.canHitBlock(tileX, tileY)) return;
    const block = this.getBlockAt(tileX, tileY);
    block.hit();
  }

  setBlock(block: Block) {
    this.blockInstances[block.position.y][block.position.x] = block;
    this.worldMetadata.blockArr[block.position.y][block.position.x] =
      block.metadata.id;

    return block;
  }

  setBlockAt(tileX: number, tileY: number, block: Block) {
    this.blockInstances[tileY][tileX] = block;
    this.worldMetadata.blockArr[block.position.y][block.position.x] =
      block.metadata.id;

    return block;
  }

  canHitBackground(tileX: number, tileY: number) {
    const background = this.getBackgroundAt(tileX, tileY);
    if (
      background.metadata.isBreakable &&
      this.checkUpdateTileRange(tileX, tileY)
    )
      return true;
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

    const airData = ResourceManager.getBlockData(DEFAULT_AIR_ID);
    if (!airData) return log("Failed to replace. Air data is not found.");

    const newTile = this.backgroundLayer!.putTileAt(
      DEFAULT_AIR_ID,
      block.position.x,
      block.position.y,
    );

    const airBlock = new Block(
      this,
      new Phaser.Math.Vector2(block.position.x, block.position.y),
      newTile,
      airData,
    );

    this.setBackground(airBlock);
    eventManager.emit(EventKey.TILE_UPDATE, airBlock);

    return newTile;

    // return this.replaceWithAir(this.backgroundLayer!, block.tile);
  }

  setBackground(block: Block) {
    this.backgroundInstances[block.position.y][block.position.x] = block;
    this.worldMetadata.backgroundArr[block.position.y][block.position.x] =
      block.metadata.id;

    return block;
  }

  checkUpdateTileRange(tileX: number, tileY: number) {
    const sideMax = MAX_PLAYER_RANGE.x / 2;
    const upperMax = MAX_PLAYER_RANGE.y / 2;

    const tilePlayer = MathHelper.worldToTileXY(
      this.localPlayer.body?.position.x!,
      this.localPlayer.body?.position.y!,
      false,
    );

    const frontBodyLimit = tilePlayer.x + sideMax;
    const backBodyLimit = tilePlayer.x - sideMax;

    const topBodyLimit = tilePlayer.y - upperMax;
    const bottomBodyLimit = tilePlayer.y + upperMax;

    const isInHorizontalRange =
      frontBodyLimit >= tileX && backBodyLimit <= tileX;

    const isInVerticalRange = topBodyLimit <= tileY && bottomBodyLimit >= tileY;

    if (isInVerticalRange && isInHorizontalRange) return true;

    return false;
  }

  handleWorldClick(ptr: Phaser.Input.Pointer) {
    const currentPlayerTile = this.blockLayer?.worldToTileXY(
      this.localPlayer.body!.x,
      this.localPlayer.body!.y,
    );

    const currentSelectedTile = this.blockLayer?.worldToTileXY(
      ptr.worldX,
      ptr.worldY,
    );

    const sameCoor =
      currentPlayerTile!.x === currentSelectedTile!.x &&
      currentPlayerTile!.y === currentSelectedTile!.y;

    // ptr.rightButtonDown() &&
    if (
      ptr.leftButtonDown() &&
      !sameCoor &&
      this.localPlayer.inventory.selectedSlot.amount! > 0 &&
      this.localPlayer.inventory.selectedSlot.slotId !== 0
    ) {
      if (!this.localPlayer.inventory.selectedSlot.item) return;

      const blockData = ResourceManager.getBlockData(
        this.localPlayer.inventory.selectedSlot.item.id,
      );
      if (!blockData) return hackerAlert();
      const isPlaced = this.placeTile(
        this.localPlayer.inventory.selectedSlot.item.id,
        blockData?.type,
        ptr.worldX,
        ptr.worldY,
      );

      if (isPlaced) this.localPlayer.inventory.selectedSlot.decrease();
    }
    // !isBedrock &&
    if (
      ptr.leftButtonDown() &&
      this.localPlayer.inventory.selectedSlot.slotId === 0
    ) {
      const { x, y } = MathHelper.worldToTileXY(ptr.worldX, ptr.worldY);
      const bg = this.getBackgroundAt(x, y);
      const block = this.getBlockAt(x, y);

      if (!block.isAir()) {
        this.hitBlock(x, y);
      } else if (bg.isBackground()) {
        this.hitBackground(x, y);
      }
    }
  }

  placeTile(itemId: number, type: BlockTypes, worldX: number, worldY: number) {
    const layer =
      type === BlockTypes.BLOCK ? this.blockLayer : this.backgroundLayer;
    const tileCoords = layer?.worldToTileXY(worldX, worldY)!;
    const tile = layer?.getTileAtWorldXY(worldX, worldY)!;
    if (!this.checkUpdateTileRange(tile.x, tile.y)) return;

    if (tile.index === DEFAULT_AIR_ID) {
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

      switch (type) {
        case BlockTypes.BLOCK:
          this.setBlock(block);
          break;
        case BlockTypes.BACKGROUND:
          this.setBackground(block);
          break;
      }

      // this.updateLayerCollision(this.blockLayer!);
      eventManager.emit(EventKey.TILE_UPDATE, block);

      return true;
    }

    return false;
  }

  updateLayerCollision(
    layer: Phaser.Tilemaps.TilemapLayer,
    exclusionArray = BLOCK_COLLISION_EXCLUSION,
  ) {
    layer.setCollisionByExclusion(exclusionArray);
  }

  updateCollisions() {
    this.updateLayerCollision(this.blockLayer!);
    this.updateLayerCollision(this.backgroundLayer!);
    log("Collisions updated");
  }

  addLocalPlayer() {
    const name = "tomi";
    eventManager.emit(EventKey.REQUEST_JOIN, {
      x: 100,
      y: 450,
      name,
    });

    this.localPlayer = this.add.LocalPlayer(100, 450, "dude", name);
    this.localPlayer.playerName.setText(name);
    const ply = this.add.RemotePlayer(100, 450, "dude", name);
    this.remotePlayers.push(ply);
    this.physics.add.collider(
      [this.localPlayer, this.localPlayer.playerContainer],
      this.blockLayer!,
    );

    this.physics.add.collider(
      [
        ...this.remotePlayers,
        ...this.remotePlayers.map((ply) => ply.playerContainer),
      ],
      this.blockLayer!,
    );
    store.dispatch(setJoinWorld(true));
  }

  attachListeners() {
    this.input.on("pointerdown", this.handleWorldClick.bind(this));

    eventManager.on(EventKey.TILE_UPDATE, this.onTileUpdate, this);
    eventManager.on(EventKey.NET_REGISTERED, this.onNetworkRegistered, this);
    eventManager.emit(EventKey.TILE_UPDATE, true);
    log("Events attached.");
  }

  onTileUpdate() {
    this.updateCollisions();
    log("Tile updated.");
  }

  // basically convert tile arr to instances of Block class based on the tile data
  addTileInstances(tileArr: number[][], layer: Phaser.Tilemaps.TilemapLayer) {
    const instances = tileArr.map((rows, parentIdx) => {
      return rows.map((block, idx) => {
        const blockData = ResourceManager.getBlockData(block)!;
        const cord = new Phaser.Math.Vector2(idx, parentIdx);
        const tile = layer?.getTileAt(idx, parentIdx)!;

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

    return instances;
  }

  createMap() {
    const map = WorldGenerator.createTilemap(this, this.worldMetadata.blockArr);
    const mapBg = WorldGenerator.createTilemap(
      this,
      this.worldMetadata.backgroundArr,
    );

    const tilesBlock = ResourceManager.getAllSpriteSheets().map(
      (spriteSheet) => {
        return map.addTilesetImage(spriteSheet.id)!;
      },
    );

    const tilesBg = ResourceManager.getAllSpriteSheets().map((spriteSheet) => {
      return mapBg.addTilesetImage(spriteSheet.id)!;
    });

    if (!tilesBg.length || !tilesBlock.length) {
      return log("Adding tileset failed. Tiles is invalid");
    }

    this.backgroundLayer = mapBg.createLayer(0, tilesBg, 0, 0);
    this.blockLayer = map.createLayer(0, tilesBlock, 0, 0);
    this.backgroundLayer?.setDepth(1);
    this.blockLayer?.setDepth(2);

    // this.updateLayerCollision(this.blockLayer!);
    // this.updateCollisions()

    this.blockInstances = this.addTileInstances(
      this.worldMetadata.blockArr,
      this.blockLayer!,
    );
    this.backgroundInstances = this.addTileInstances(
      this.worldMetadata.backgroundArr,
      this.backgroundLayer!,
    );
  }

  update() {
    if (this.cursors && this.localPlayer) this.localPlayer.update(this.cursors);
  }
}
