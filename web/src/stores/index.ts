import { configureStore } from "@reduxjs/toolkit";
import worldReducer from "./WorldStore";
import playerReducer from "./playerStore";
import inventoryReducer from "./inventoryStore";

const store = configureStore({
  reducer: {
    world: worldReducer,
    player: playerReducer,
    inventory: inventoryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
