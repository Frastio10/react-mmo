import store from "../../stores";
import { forceUpdate} from "../../stores/inventoryStore";
import Item from "../ItemModel";

export default class InventorySlot {
  slotId: number;
  item?: Item | null;
  amount?: number | null;

  constructor(id: number, item?: Item, amount?: number) {
    this.slotId = id;
    this.item = item;
    this.amount = amount;
  }

  setItem(item: Item | null, amount: number | null) {
    this.item = item;
    this.amount = amount;
  }

  decrease(amount?: number) {
    if (!this.amount || this.amount < 1) return;
    this.amount = this.amount - (amount || 1);
    if (this.amount === 0) {
      this.setItem(null, null);
    }

    store.dispatch(forceUpdate(Math.random()));
    return this.amount;
  }
}
