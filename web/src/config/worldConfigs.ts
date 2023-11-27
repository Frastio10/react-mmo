import ResourceManager from "../models/ResourceManager";

export const BLOCK_COLLISION_EXCLUSION =
  ResourceManager.getNonCollidableBlocks().map((block) => block.id);
