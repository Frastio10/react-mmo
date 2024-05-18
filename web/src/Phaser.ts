import Phaser from "phaser";
// import { BLOCK_SIZE } from "./config/constant";

import Bootstrap from "./scenes/Bootstrap";
import World from "./scenes/World";
import Preloader from "./scenes/Preloader";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "phaser-container",
  mode: Phaser.Scale.FIT,
  width: window.innerWidth,
  height: window.innerHeight,
  physics: {
    default: "arcade",
    arcade: {
      // gravity: { y: 2300 },
      gravity: { y: 2400 },
      debug: true,
      debugShowVelocity: true,
      overlapBias: 200,
    },
  },
  dom: {
    createContainer: true,
  },
  scene: [Preloader, Bootstrap, World],
};

const phaserGame = new Phaser.Game(config);

(window as any).game = phaserGame;

export default phaserGame;
