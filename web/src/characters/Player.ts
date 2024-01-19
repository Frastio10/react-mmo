import Phaser from "phaser";

export default abstract class Player extends Phaser.Physics.Arcade.Sprite {
  id: string;
  playerName: Phaser.GameObjects.Text;
  playerContainer: Phaser.GameObjects.Container;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    id: string,
    frame?: string | number,
  ) {
    super(scene, x, y, texture, frame);
    this.id = id;
    this.setDepth(10000);
    this.playerContainer = this.scene.add
      .container(this.x, this.y)
      .setDepth(50000)
      .setSize(this.width, this.height);

    // add playerName to playerContainer
    this.playerName = this.scene.add
      .text(0, 0, "Frastio")
      .setFontFamily("Arial")
      .setFontSize(16)
      .setColor("#000000")
      .setOrigin(0.5, 2.2)
      .setDepth(10000000000000000);

    this.playerContainer.add(this.playerName);

    this.scene.physics.world.enable(this.playerContainer);

    // const playerBody = this.playerContainer.body as Phaser.Physics.Arcade.Body;
    // const collisionScale = [1, 0.5];
    // playerBody
    //   ?.setSize(
    //     this.width * collisionScale[0],
    //     this.height * collisionScale[1],
    //   )
    //   .setOffset(
    //     this.width * (1 - collisionScale[0]) * 0.5,
    //     this.height * (1 - collisionScale[1]),
    //   );

    // playerBody
    //   ?.setSize(PLAYER_SIZE.x, PLAYER_SIZE.y)
    //   .setOffset(0, PLAYER_SIZE.y / 1.4);
  }
}
