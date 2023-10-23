import Phaser from "phaser";
import World from "../../../scenes/World";

interface BlockMetadata {
  id: number;
  health: number;
  spriteKey: number;
}

export default class Block {
  private world: World;
  private tile: Phaser.Tilemaps.Tile;
  private metadata: BlockMetadata;

  constructor(world: World, tile: Phaser.Tilemaps.Tile, opts: BlockMetadata) {
    this.world = world;
    this.tile = tile;
    this.metadata = opts;

    console.log(this.world, this.tile, this.metadata);
  }

  onCollideWithPlayer() {}
}
