import {
  DEFAULT_BACKGROUND_BLOCK_ID,
  DEFAULT_GROUND_BLOCK_ID,
  FIST_ID,
} from "../../config/constant";
import { createArray, hackerAlert } from "../../utils";
import Item from "../ItemModel";
import InventorySlot from "./InventorySlot";

export default class InventoryModel {
  public selectedSlot: InventorySlot;
  public highlightItems: InventorySlot[];
  public slots!: InventorySlot[];

  constructor() {
    const defaultBlock = new Item(DEFAULT_GROUND_BLOCK_ID, "Ground");
    const defaultBg = new Item(DEFAULT_BACKGROUND_BLOCK_ID, "Background");

    this.slots = createArray(30).map((_, idx) => {
      return new InventorySlot(idx);
    });

    this.slots[0].setItem(new Item(FIST_ID, "Fist"), 0);
    this.slots[1].setItem(defaultBlock, 22);
    this.slots[2].setItem(defaultBg, 22);
    this.slots[3].setItem(new Item(23, "tsti"), 22);
    this.slots[4].setItem(new Item(35, "tsti"), 22);

    this.highlightItems = createArray(8).map((_, i) => this.slots[i]);
    console.log("ran");

    this.selectedSlot = this.highlightItems[0];
  }

  findItemSlot(itemId: number) {
    const item = this.slots.find((slot) => slot.item?.id === itemId);
    return item;
  }

  getSlot(slotId: number) {
    const slot = this.slots.find((slot) => slot.slotId === slotId);
    return slot;
  } 

  setSelectedSlot(slotId: number) {
    const selected = this.getSlot(slotId);
    if (!selected) return hackerAlert();

    this.selectedSlot = selected;
  }

  setSelectedItem(itemId: number) {
    const selected = this.findItemSlot(itemId);
    if (!selected) return hackerAlert();

    this.selectedSlot = selected;

    return this.selectedSlot;
  }
}
