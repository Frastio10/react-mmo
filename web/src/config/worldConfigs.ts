import ResourceManager from "../models/ResourceManager";
import { DEFAULT_AIR_ID } from "./constant";

export const BLOCK_COLLISION_EXCLUSION =
  ResourceManager.getNonCollidableBlocks().map((block) => block.id);
