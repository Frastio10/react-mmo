import {
  BLOCK_SIZE,
  DEFAULT_AIR_ID,
  DEFAULT_BACKGROUND_BLOCK_ID,
  DEFAULT_GROUND_BLOCK_ID,
  GROUND_HEIGHT,
  WORLD_WIDTH,
  maxBlankHeight,
} from "../config/constant";

export function generateBasicWorldArrays() {
  const blockArr = [];
  const bgArr = [];

  for (let i = 0; i < maxBlankHeight; i++) {
    const array = Array(WORLD_WIDTH).fill(DEFAULT_AIR_ID);
    blockArr.push(array);
  }

  for (let i = 0; i < GROUND_HEIGHT; i++) {
    const array = Array(WORLD_WIDTH).fill(DEFAULT_GROUND_BLOCK_ID);
    blockArr.push(array);
  }

  for (let i = 0; i < maxBlankHeight - 3; i++) {
    const array = Array(WORLD_WIDTH).fill(DEFAULT_AIR_ID);
    bgArr.push(array);
  }

  for (let i = 0; i < GROUND_HEIGHT + 3; i++) {
    const array = Array(WORLD_WIDTH).fill(DEFAULT_BACKGROUND_BLOCK_ID);
    bgArr.push(array);
  }

  return {
    blockArr,
    bgArr,
  };
}

export function createTilemap(scene: Phaser.Scene, tilemapArr: number[][]) {
  return scene.make.tilemap({
    data: tilemapArr,
    tileWidth: BLOCK_SIZE,
    tileHeight: BLOCK_SIZE,
  });
}
