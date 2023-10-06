import Phaser from "phaser";
// import { BLOCK_SIZE } from "./config/constant";

import Bootstrap from "./scenes/Bootstrap";
import World from "./scenes/World";
import Preloader from "./scenes/Preloader";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "phaser-container",
  width: window.innerWidth,
  height: window.innerHeight,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 2300 },
      debug: true,
    },
  },
  dom: {
    createContainer: true,
  },
  scene: [Preloader, Bootstrap, World],
};

export default new Phaser.Game(config);
