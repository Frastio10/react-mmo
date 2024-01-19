import Phaser from "phaser";
import { BLOCK_SIZE } from "../config/constant";
import ResourceManager from "../models/ResourceManager";
import ImageLoader from "../utils/ImageLoader";

export default class Preloader extends Phaser.Scene {
  constructor() {
    super("preloader");
  }

  preload() {
    this.load.image(
      "mario-tiles",
      "https://labs.phaser.io/assets/tilemaps/tiles/super-mario.png",
    );
    // this.load.spritesheet("gt-tiles_1", "gt-assets/tiles_page1.png", {
    //   frameWidth: BLOCK_SIZE,
    //   frameHeight: BLOCK_SIZE,
    // });

    const spriteSheets = ResourceManager.getAllSpriteSheets();
    spriteSheets.forEach((spriteSheet) => {
      ImageLoader.loadBase64(spriteSheet.data, (img) => {
        this.textures.addSpriteSheet(spriteSheet.id, img, {
          frameWidth: BLOCK_SIZE,
          frameHeight: BLOCK_SIZE,
        });
      });
    });

    // this.load.spritesheet
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
