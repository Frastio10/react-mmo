import blocks from "../../resources/blocks.json";
import { BlockMetadata } from "./Worlds/Block";

export default class ResourceManager {
  blocksData: BlockMetadata[];

  constructor() {
    this.blocksData = blocks as BlockMetadata[];
  }

  static getBlockData(id: number) {
    return (blocks as BlockMetadata[]).find((block) => block.id === id);
  }

  static getNonCollidableBlocks() {
    return (blocks as BlockMetadata[]).filter((block) => !block.isCollide);
  }
}
