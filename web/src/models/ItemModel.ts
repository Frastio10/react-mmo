import Phaser from "phaser";

export default class Item {
  id: number;
  name: string;
  texture?: Phaser.Physics.Arcade.Sprite;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}
