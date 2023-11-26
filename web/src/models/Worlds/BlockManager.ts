import World from "../../scenes/World";

export default class BlockManager {
  private world: World;

  constructor(world: World) {
    this.world = world;


    console.log(this.world);
  }

  static getBlockInstance(id: number) {
    return id;
  }
}
