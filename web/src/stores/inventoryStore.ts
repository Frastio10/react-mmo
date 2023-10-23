import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import World from "../scenes/World";

interface InventoryState {
  selectedSlot: number | null;
  renderId: number;
}

const initialState = {
  selectedSlot: null,
  renderId: 0,
} as InventoryState;

export const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    setSelectedSlot: (
      state,
      action: PayloadAction<{ slotId: number; world: World }>,
    ) => {
      action.payload.world.localPlayer.inventory.setSelectedSlot(
        action.payload.slotId,
      );

      state.selectedSlot = action.payload.slotId;
    },

    forceUpdate: (state, action: PayloadAction<number>) => {
      // action.payload.world.localPlayer.inventory.setSelectedSlot(
      //   action.payload.slotId,
      // );

      // state.selectedSlot = action.payload.slotId;
      state.renderId = action.payload;
    },
  },
});

export const { setSelectedSlot, forceUpdate } = inventorySlice.actions;
export default inventorySlice.reducer;
