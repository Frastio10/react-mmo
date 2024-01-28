import Phaser from "phaser";
import World from "../scenes/World";
import InventoryModel from "../models/Inventory/InventoryModel";
import { NavKeys } from "../types/KeyboardState";
import store from "../stores";
import { forceUpdate } from "../stores/inventoryStore";
import Player from "./Player";
import { PLAYER_SIZE } from "../config/constant";
import Network from "../services/Network";

export default class LocalPlayer extends Player {
  world!: World;
  inventory = new InventoryModel();
  breakingRange = [6, 4];
  containerBody: Phaser.Physics.Arcade.Body;

  maxJumpRange = 15;
  jumpTimer = 0;

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

  update(cursors: NavKeys, network: Network) {
    const speed = 160;
    const isOnGround = this.body?.blocked.down;

    const velocity = {
      x: 0,
      y: 0,
    };

    const controls = {
      left: cursors?.left.isDown || cursors.A.isDown,
      right: cursors?.right.isDown || cursors.D.isDown,
      respawn: cursors.R.isDown,
      changeInv: cursors.shift.isDown,
      jump: cursors?.up.isDown || cursors?.space.isDown || cursors?.W.isDown,
    };

    if (controls.left && this.x > PLAYER_SIZE.x / 2) {
      velocity.x -= speed;
      this.anims.play("left", true);
    } else if (controls.right) {
      velocity.x += speed;
      this.anims.play("right", true);
    } else {
      velocity.x = 0;
      this.anims.play("turn");
    }

    // respawn
    if (controls.respawn) this.respawn();

    if (controls.changeInv) {
      if (!this.inventory.selectedSlot.item) return;
      this.inventory.selectedSlot.item.id += 1;
      store.dispatch(forceUpdate(Math.random()));
    }

    if (controls.jump && this.jumpTimer < this.maxJumpRange) {
      this.jumpTimer = Math.min(this.jumpTimer + 1, this.maxJumpRange);

      // if (this.body?.blocked.down) {
      velocity.y -= 30 * this.jumpTimer;
      this.setVelocityY(velocity.y);
      this.containerBody.setVelocityY(velocity.y);
      // }
    }

    if (isOnGround) this.jumpTimer = 0;

    this.setVelocityX(velocity.x);
    this.containerBody.setVelocityX(velocity.x);
    if (velocity.x !== 0 || velocity.y !== 0)
      network.updatePlayer(this.x, this.y);
  }
}

declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      LocalPlayer(
        x: number,
        y: number,
        texture: string,
        id: string,
        frame?: string | number,
      ): LocalPlayer;
    }
  }
}

Phaser.GameObjects.GameObjectFactory.register(
  "LocalPlayer",
  function (
    this: Phaser.GameObjects.GameObjectFactory,
    x: number,
    y: number,
    texture: string,
    id: string,
    frame?: string | number,
  ) {
    const sprite = new LocalPlayer(this.scene, x, y, texture, id, frame);
    sprite.create(this.scene as World);

    this.displayList.add(sprite);
    this.updateList.add(sprite);

    this.scene.physics.world.enableBody(
      sprite,
      Phaser.Physics.Arcade.DYNAMIC_BODY,
    );

    sprite.body
      ?.setSize(PLAYER_SIZE.x, PLAYER_SIZE.y)
      .setOffset(1, PLAYER_SIZE.y / 1.4);

    sprite.containerBody
      ?.setSize(PLAYER_SIZE.x, PLAYER_SIZE.y)
      .setOffset(1, PLAYER_SIZE.y / 1.4);

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
    // sprite.setBounce(0.2);
    // sprite.setCollideWorldBounds(true);
    // sprite.containerBody.setCollideWorldBounds(true);
    return sprite;
  },
);
