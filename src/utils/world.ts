import { BLOCK_SIZE } from "../config/constant";

export function generateBasicWorldArrays() {
  const blockArr = [];
  const bgArr = [];

  for (let i = 0; i < 65; i++) {
    const array = Array(100).fill(null);
    blockArr.push(array);
  }

  for (let i = 0; i < 5; i++) {
    const array = Array(100).fill(39);
    blockArr.push(array);
  }

  for (let i = 0; i < 63; i++) {
    const array = Array(100).fill(null);
    bgArr.push(array);
  }

  for (let i = 0; i < 7; i++) {
    const array = Array(100).fill(33);
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
