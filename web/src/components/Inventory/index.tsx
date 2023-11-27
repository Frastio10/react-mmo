import styled from "styled-components";
import phaserGame from "../../Phaser";
import WorldModel from "../../scenes/World";
// import { useState } from "react";
import { useAppSelector } from "../../hooks";
import store from "../../stores";
// import { setSelectedSlot } from "../../stores/playerStore";
import Slot from "./Slot";
import { setSelectedSlot } from "../../stores/inventoryStore";
import { useEffect, useState } from "react";
import Window from "./Window";
// import { useEffect } from "react";

export default function Inventory() {
  const [isInvOpen, setIsInvOpen] = useState(false);
  const selectedSlot = useAppSelector((state) => state.inventory.selectedSlot);

  const world = phaserGame.scene.keys.world as WorldModel;
  useEffect(() => {
    store.dispatch(
      setSelectedSlot({
        slotId: world.localPlayer.inventory.selectedSlot.slotId,
        world,
      }),
    );
  }, []);

  return (
    <Wrapper id="inventory">
      {isInvOpen && <Window />}
      <Highlights>
        {world.localPlayer.inventory.highlightItems.map((slot, idx) => (
          <Slot
            key={idx}
            isSelected={slot.slotId === selectedSlot}
            onClick={() =>
              store.dispatch(setSelectedSlot({ slotId: slot.slotId, world }))
            }
            slot={slot}
            world={world}
          />
        ))}
        <Slot isSelected={false} onClick={() => setIsInvOpen(!isInvOpen)}>
          <span>More</span>
        </Slot>
      </Highlights>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100vw;
  display: flex;
  /* height: 100vh; */
  justify-content: center;
  position: fixed;
  bottom: 0;
`;

const Highlights = styled.div`
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  /* width: 30%; */
  /* grid-template-columns: 1fr 1fr 1fr 1fr 1fr; */
  /* border: 3px solid blue; */
`;
