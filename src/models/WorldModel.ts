export default class WorldModel {
  blockArr: number[];
  backgroundArr: number[];

  id: string;
  name: string;
  weatherType: string;

  constructor() {
    this.blockArr = [];
    this.backgroundArr = [];
    this.id = "";
    this.name = "";
    this.weatherType= "sky";
  }

  loadCopy(world: WorldModel) {
    this.id = world.id;
    this.blockArr = world.blockArr;
    this.backgroundArr = world.backgroundArr;
    this.name = world.name;
    this.weatherType = world.weatherType;
  }
}
