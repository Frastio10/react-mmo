import blocks from "../../resources/blocks.json";
import spritesheets from "../../resources/spritesheets.json";
import { SPRITESHEET_SIZE } from "../config/constant";
import { BlockTypes } from "../types/Enums";
import { BlockMetadata } from "./Worlds/Block";

interface SpriteSheetData {
  id: string;
  data: string;
}

export default class ResourceManager {
  blocksData: BlockMetadata[];

  constructor() {
    this.blocksData = blocks as BlockMetadata[];
  }

  static getBlocksByType(type: BlockTypes) {
    return (blocks as BlockMetadata[]).filter((block) => block.type === type);
  }

  static getBlockData(id: number) {
    return (blocks as BlockMetadata[]).find((block) => block.id === id);
  }

  static getNonCollidableBlocks() {
    return (blocks as BlockMetadata[]).filter((block) => !block.isCollide);
  }

  static getCollidableBlocks() {
    return (blocks as BlockMetadata[]).filter((block) => block.isCollide);
  }

  static searchBlockByName(name: string) {
    return (blocks as BlockMetadata[]).filter((block) =>
      block.displayName.includes(name),
    );
  }

  static getAllBlockdata() {
    return blocks as BlockMetadata[];
  }

  // Sprite Sheets
  static getSpriteSheet(id: string) {
    return (spritesheets as SpriteSheetData[]).find(
      (spritesheet) => spritesheet.id === id,
    );
  }

  static getBlockSpriteSheets() {
    return (spritesheets as SpriteSheetData[]).filter((spritesheet) =>
      spritesheet.id.includes("block"),
    );
  }

  static getBackgroundSpriteSheets() {
    return (spritesheets as SpriteSheetData[]).filter((spritesheet) =>
      spritesheet.id.includes("background"),
    );
  }

  static getAllSpriteSheets() {
    return spritesheets as SpriteSheetData[];
  }

  /**
   * Get spritesheet key based on the block id
   */
  static getBlockSpriteSheetKey(id: number) {
    return "Sheet_" + (Math.ceil(id / SPRITESHEET_SIZE) - 1);
  }
}
