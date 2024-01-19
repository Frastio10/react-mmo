import styled from "styled-components";
import InventorySlot from "../../models/Inventory/InventorySlot";
import WorldModel from "../../scenes/World";
import { useAppSelector } from "../../hooks";
import { ReactNode } from "react";
import ResourceManager from "../../models/ResourceManager";

interface SlotProps {
  slot?: InventorySlot;
  world?: WorldModel;
  isSelected: boolean;
  children?: ReactNode;
  [key: string]: any;
}

export default function Slot({
  slot,
  world,
  isSelected,
  children,
  ...rest
}: SlotProps) {
  // basically force react to rerender .. smh react
  useAppSelector((state) => state.inventory.renderId);

  return (
    <Wrapper
      style={{
        border: isSelected ? "3px solid white" : "",
      }}
      {...rest}
    >
      {children}
      {slot && slot.item && world && (
        <Thumb
          src={world.textures.getBase64(
            ResourceManager.getBlockSpriteSheetKey(slot.item.id),
            slot.item.id,
          )}
          draggable="false"
        />
      )}
      {slot && slot.amount !== 0 && <Counter>{slot.amount}</Counter>}
    </Wrapper>
  );
}

const Counter = styled.span`
  position: absolute;
  font-weight: 90;
  /* color: white; */
  font-size: 18px;
  bottom: 5%;
  right: 5%;
`;

const Thumb = styled.img`
  width: 80%;
  height: 80%;
`;

const Wrapper = styled.div`
  display: inline;
  height: 60px;
  width: 60px;
  background: rgba(0, 169, 255, 0.6);
  position: relative;

  border-radius: 8px;
  /* background: ; */
  border: 3px solid rgb(0, 169, 255);
  gap: 2px;

  display: flex;
  justify-content: center;
  align-items: center;
`;
