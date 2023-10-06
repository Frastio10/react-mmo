import Phaser from "phaser";
import World from "../scenes/World";
import InventoryModel from "../models/InventoryModel";
import { NavKeys } from "../types/KeyboardState";
import { BEDROCK_ID } from "../config/constant";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  world!: World;
  inventory = new InventoryModel();

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number,
  ) {
    super(scene, x, y, texture, frame);
  }

  create(world: World) {
    this.world = world;
    this.world.input.on("pointerdown", this.handleWorldClick.bind(this));
  }

  handleWorldClick(ptr: Phaser.Input.Pointer) {
    const currentPlayerTile = this.world.blockLayer?.worldToTileXY(
      this.body!.x,
      this.body!.y,
    );

    const currentSelectedTile = this.world.blockLayer?.worldToTileXY(
      ptr.worldX,
      ptr.worldY,
    );

    const sameCoor =
      currentPlayerTile!.x === currentSelectedTile!.x &&
      currentPlayerTile!.y === currentSelectedTile!.y;

    const isBedrock =
      this.world.blockLayer?.getTileAt(
        currentSelectedTile!.x,
        currentSelectedTile!.y,
      ).index === BEDROCK_ID;

    if (ptr.rightButtonDown() && !sameCoor) {
      this.world.placeTile(this.inventory.selectedItem, ptr.worldX, ptr.worldY);
    }

    if (ptr.leftButtonDown() && !isBedrock) {
      this.world.removeTile(ptr.worldX, ptr.worldY);
    }
  }

  update(cursors: NavKeys) {
    if (cursors?.left.isDown || cursors.A.isDown) {
      this.setVelocityX(-160);
      this.anims.play("left", true);
    } else if (cursors?.right.isDown || cursors.D.isDown) {
      this.setVelocityX(160);
      this.anims.play("right", true);
    } else {
      this.setVelocityX(0);
      this.anims.play("turn");
    }

    if (cursors.shift.isDown) {
      this.inventory.selectedItem += 1;
    }

    if (
      this.body?.blocked.down &&
      (cursors?.up.isDown || cursors?.space.isDown || cursors?.W.isDown)
    ) {
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
    sprite.create(this.scene as World);

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
