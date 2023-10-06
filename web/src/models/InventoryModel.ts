import {
  DEFAULT_BACKGROUND_BLOCK_ID,
  DEFAULT_GROUND_BLOCK_ID,
} from "../config/constant";

export default class InventoryModel {
  public selectedItem: number;
  public highlightItems: number[];
  public items!: number[];

  constructor() {
    this.selectedItem = DEFAULT_GROUND_BLOCK_ID;
    this.highlightItems = [
      DEFAULT_GROUND_BLOCK_ID,
      DEFAULT_BACKGROUND_BLOCK_ID,
    ];

    this.items = [DEFAULT_BACKGROUND_BLOCK_ID, DEFAULT_BACKGROUND_BLOCK_ID];
  }

  setSelectedItem(itemId: number) {
    return (this.selectedItem = itemId);
  }
}
