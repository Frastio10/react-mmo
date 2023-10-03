import Phaser from "phaser";
import { BLOCK_SIZE } from "../config/constant";
export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number,
  ) {
    super(scene, x, y, texture, frame);
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    if (cursors?.left.isDown && this.body?.position.x! > 0) {
      this.setVelocityX(-160);
      this.anims.play("left", true);
    } else if (cursors?.right.isDown && this.body?.position.x! < BLOCK_SIZE * 100) {
      this.setVelocityX(160);
      this.anims.play("right", true);
    } else {
      this.setVelocityX(0);
      this.anims.play("turn");
    }

    if (cursors?.up.isDown && this.body?.blocked.down) {
      this.setVelocityY(-800);
    }
  }
}

declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      Player(
        x: number,
        y: number,
        texture: string,
        frame?: string | number,
      ): Player;
    }
  }
}

Phaser.GameObjects.GameObjectFactory.register(
  "Player",
  function (
    this: Phaser.GameObjects.GameObjectFactory,
    x: number,
    y: number,
    texture: string,
    frame?: string | number,
  ) {
    const sprite = new Player(this.scene, x, y, texture, frame);

    this.displayList.add(sprite);
    this.updateList.add(sprite);

    this.scene.physics.world.enableBody(
      sprite,
      Phaser.Physics.Arcade.DYNAMIC_BODY,
    );

    const collisionScale = [0.5, 0.2];
    sprite.body
      ?.setSize(
        sprite.width * collisionScale[0],
        sprite.height * collisionScale[1],
      )
      .setOffset(
        sprite.width * (1 - collisionScale[0]) * 0.5,
        sprite.height * (1 - collisionScale[1]),
      );

    // sprite.setBounce(0.2);
    // sprite.setCollideWorldBounds(true);
    return sprite;
  },
);
