import Phaser from "phaser";
import {
  BEDROCK_ID,
  BLOCK_SIZE,
  DEFAULT_AIR_ID,
  DEFAULT_BACKGROUND_BLOCK_ID,
  DEFAULT_GROUND_BLOCK_ID,
  GROUND_HEIGHT,
  WORLD_WIDTH,
  maxBlankHeight,
} from "../config/constant";

export default class WorldGenerator {
  static generateBasicWorldArrays() {
    const blockArr = [];
    const bgArr = [];

    // air layer
    for (let i = 1; i < maxBlankHeight; i++) {
      const array = Array(WORLD_WIDTH).fill(DEFAULT_AIR_ID);
      blockArr.push(array);
    }

    // ground layer
    for (let i = 0; i < GROUND_HEIGHT - 2; i++) {
      const array = Array(WORLD_WIDTH).fill(DEFAULT_GROUND_BLOCK_ID);
      blockArr.push(array);
    }
    // bedrock
    for (let i = 0; i < GROUND_HEIGHT; i++) {
      const array = Array(WORLD_WIDTH).fill(BEDROCK_ID);
      blockArr.push(array);
    }

    // bg air
    for (let i = 0; i < maxBlankHeight - 3; i++) {
      const array = Array(WORLD_WIDTH).fill(DEFAULT_AIR_ID);
      bgArr.push(array);
    }

    // bg
    for (let i = 0; i < GROUND_HEIGHT + 3; i++) {
      const array = Array(WORLD_WIDTH).fill(DEFAULT_BACKGROUND_BLOCK_ID);
      bgArr.push(array);
    }

    return {
      blockArr,
      bgArr,
    };
  }

  static createTilemap(scene: Phaser.Scene, tilemapArr: number[][]) {
    const tilemap = scene.make.tilemap({
      data: tilemapArr,
      tileWidth: BLOCK_SIZE,
      tileHeight: BLOCK_SIZE,
    });

    return tilemap;
  }
}
