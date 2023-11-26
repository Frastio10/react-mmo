import Phaser from "phaser";
import World from "../../scenes/World";
import { BlockTypes } from "../../types/Enums";

export interface BlockMetadata {
  id: number;
  spriteKey?: number;
  displayName: string;
  health?: number;
  isBreakable?: boolean;
  isCollide?: boolean;
  type: BlockTypes;
}

export default class Block {
  private world: World;
  public metadata: BlockMetadata;
  public position: Phaser.Math.Vector2;
  public tile: Phaser.Tilemaps.Tile;
  public currentHealth: number;
  public recoverTimeout: number;

  constructor(
    world: World,
    position: Phaser.Math.Vector2,
    tile: Phaser.Tilemaps.Tile,
    opts: BlockMetadata,
  ) {
    const defaultOpts = {
      health: 100,
      isBreakable: true,
      isCollide: true,
      ...opts,
    };
    this.recoverTimeout = 0;
    this.world = world;
    this.position = position;
    this.tile = tile;
    this.metadata = defaultOpts;
    this.currentHealth = this.metadata.health!;
  }

  onCollideWithPlayer() {}

  setHealth(health: number) {
    this.tile.setAlpha(health / 100);
    this.currentHealth = Math.max(health, 0);
  }

  hit(damage = 40) {
    if (this.isAir()) return;
    this.setHealth(this.currentHealth - damage);

    clearTimeout(this.recoverTimeout);
    this.recoverTimeout = setTimeout(() => {
      this.setHealth(100);
    }, 3000);

    if (this.currentHealth <= 0) {
      this.destroy();
    }

    console.log("current health:", this.currentHealth);
  }

  destroy() {
    clearTimeout(this.recoverTimeout);
    console.log(this.isBackground());
    if (this.isBlock()) {
      this.world.removeBlockAt(this.position.x, this.position.y);
    } else if (this.isBackground()) {
      this.world.removeBackgroundAt(this.position.x, this.position.y);
    }
  }

  onDestroyed() {}

  getBase64Texture() {
    return this.world.textures.getBase64("gt-tilkes_1", this.metadata.id);
  }

  isSolid() {
    return this.metadata.isCollide;
  }

  isBreakable() {
    return this.metadata.isBreakable;
  }

  isBackground() {
    return this.metadata.type === BlockTypes.BACKGROUND;
  }

  isBlock() {
    return this.metadata.type === BlockTypes.BLOCK;
  }

  isAir() {
    return this.metadata.type === BlockTypes.AIR;
  }
}
