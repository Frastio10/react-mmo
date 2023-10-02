import Phaser from "phaser";
// import { BLOCK_SIZE } from "./config/constant";

import GameScene from "./scenes/GameScene";
import Preloader from "./scenes/Preloader";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "phaser-container",
  width: 1000,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 2300 },
      debug: true,
    },
  },
  scene: [Preloader, GameScene],
};



export default new Phaser.Game(config);
