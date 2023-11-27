import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import World from "../scenes/World";

interface PlayerState {
  worldInstance: any;
  selectedSlot: number | null;
}

const initialState = {
  worldInstance: null,
  selectedSlot: null,
} as PlayerState;

export const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    initiateWorld: (state, action: PayloadAction<any>) => {
      state.worldInstance = action.payload;
    },
    setSelectedSlot: (state, action: PayloadAction<number>) => {
      const world = state.worldInstance as World;

      world.localPlayer.inventory.setSelectedSlot(action.payload);
      // const slot = player.inventory.findItemSlot(action.payload);
      // if(!slot) return console.log("You sneaky")

      state.selectedSlot = action.payload;
    },
  },
});

export const { setSelectedSlot, initiateWorld } = playerSlice.actions;
export default playerSlice.reducer;
