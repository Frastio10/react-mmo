import ResourceManager from "../models/ResourceManager";

export const BLOCK_SIZE = 32;
export const WORLD_HEIGHT = 35;
export const WORLD_WIDTH = 50;

export const GROUND_HEIGHT = 5;
export const maxBlankHeight = WORLD_HEIGHT - GROUND_HEIGHT;

export const DEFAULT_GROUND_BLOCK_ID = 4;
export const DEFAULT_AIR_ID = ResourceManager.searchBlockByName("Air")[0].id;
export const DEFAULT_BACKGROUND_BLOCK_ID =
  ResourceManager.searchBlockByName("Flowery Wallpaper")[0].id;

export const BEDROCK_ID = 1;

export const FIST_ID = 2;

export const SPRITESHEET_SIZE = 1024;

export const MAX_PLAYER_RANGE = {
  x: 8,
  y: 6,
};
