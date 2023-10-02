import Phaser from "phaser";
export default class Preloader extends Phaser.Scene {
  constructor() {
    super("preloader");
  }

  preload() {
    this.load.image('mario-tiles', 'https://labs.phaser.io/assets/tilemaps/tiles/super-mario.png');
    this.load.image("sky", "assets/img/sky.png");
    this.load.image("logo", "assets/img/bomb.png");
    this.load.image("red", "assets/particles/red.png");
    this.load.image("star", "assets/particles/star.png");
    this.load.image("ground", "assets/img/platform.png");
    this.load.spritesheet("dude", "assets/img/dude.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  create() {
    this.scene.start("game");
  }
}
