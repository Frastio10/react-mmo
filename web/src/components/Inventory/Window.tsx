import styled from "styled-components";
import Slot from "./Slot";
import { createArray } from "../../utils";

export default function Window() {
  return (
    <Wrapper>
      <Inner>
        {createArray(119).map((_, idx) => (
          <Slot key={idx} isSelected={false} />
        ))}
      </Inner>
    </Wrapper>
  );
}

const Inner = styled.div`
  display: flex;
  flex-wrap: wrap;

  justify-content: center;
  background: #7752FE;
`;

const Wrapper = styled.div`
  position: absolute;
  width: 80%;
  height: 50%;


  top: 50%;
  transform: translateY(-50%);
`;
