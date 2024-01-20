import Phaser from "phaser";
import World from "../scenes/World";
import InventoryModel from "../models/Inventory/InventoryModel";
import { NavKeys } from "../types/KeyboardState";
import store from "../stores";
import { forceUpdate } from "../stores/inventoryStore";
import Player from "./Player";
import { PLAYER_SIZE } from "../config/constant";

export default class RemotePlayer extends Player {
  world!: World;
  inventory = new InventoryModel();
  breakingRange = [6, 4];
  containerBody: Phaser.Physics.Arcade.Body;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    id: string,
    frame?: string | number,
  ) {
    super(scene, x, y, texture, id, frame);
    this.setDepth(1000);
    this.containerBody = this.playerContainer
      .body as Phaser.Physics.Arcade.Body;
  }

  create(world: World) {
    this.world = world;
  }

  respawn() {
    this.setY(0);
    this.playerContainer.setY(0);
  }

  update(cursors: NavKeys) {
    const speed = 160;
    let vx = 0;
    let vy = 0;

    if (
      (cursors?.left.isDown || cursors.A.isDown) &&
      this.x > PLAYER_SIZE.x / 2
    ) {
      vx -= speed;
      this.anims.play("left", true);
    } else if (cursors?.right.isDown || cursors.D.isDown) {
      vx += speed;
      this.anims.play("right", true);
    } else {
      vx = 0;
      this.anims.play("turn");
    }

    // respawn
    if (cursors.R.isDown) this.respawn();

    if (cursors.shift.isDown) {
      if (!this.inventory.selectedSlot.item) return;
      this.inventory.selectedSlot.item.id += 1;
      store.dispatch(forceUpdate(Math.random()));
    }

    if (
      this.body?.blocked.down &&
      (cursors?.up.isDown || cursors?.space.isDown || cursors?.W.isDown)
    ) {
      vy -= 500;
      this.setVelocityY(vy);
      this.containerBody.setVelocityY(vy);
    }

    this.setVelocityX(vx);
    this.containerBody.setVelocityX(vx);
  }
}

declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      RemotePlayer(
        x: number,
        y: number,
        texture: string,
        id: string,
        frame?: string | number,
      ): RemotePlayer;
    }
  }
}

Phaser.GameObjects.GameObjectFactory.register(
  "RemotePlayer",
  function (
    this: Phaser.GameObjects.GameObjectFactory,
    x: number,
    y: number,
    texture: string,
    id: string,
    frame?: string | number,
  ) {
    const sprite = new RemotePlayer(this.scene, x, y, texture, id, frame);
    sprite.create(this.scene as World);

    this.displayList.add(sprite);
    this.updateList.add(sprite);

    this.scene.physics.world.enableBody(
      sprite,
      Phaser.Physics.Arcade.DYNAMIC_BODY,
    );

    // const collisionScale = [1, 0.5];
    // sprite.body
    //   ?.setSize(
    //     sprite.width * collisionScale[0],
    //     sprite.height * collisionScale[1],
    //   )
    //   .setOffset(
    //     sprite.width * (1 - collisionScale[0]) * 0.5,
    //     sprite.height * (1 - collisionScale[1]),
    //   );
    //
    //
    sprite.body
      ?.setSize(PLAYER_SIZE.x, PLAYER_SIZE.y)
      .setOffset(1, PLAYER_SIZE.y / 1.4);

    sprite.containerBody
      ?.setSize(PLAYER_SIZE.x, PLAYER_SIZE.y)
      .setOffset(1, PLAYER_SIZE.y / 1.4);

    // sprite.setBounce(0.2);
    // sprite.setCollideWorldBounds(true);
    // sprite.containerBody.setCollideWorldBounds(true);
    return sprite;
  },
);
