import { BLOCK_SIZE } from "../config/constant";

export default class MathHelper {
  static worldToTileXY(worldX: number, worldY: number, shouldFloor = true) {
    const serialize = (num: number) => {
      const func = shouldFloor ? Math.floor : Math.round;
      return func(num / BLOCK_SIZE);
    };

    return {
      x: serialize(worldX),
      y: serialize(worldY),
    };
  }
}
