import styled from "styled-components";
import { CONTROL_PANEL_HEIGHT } from "../../utils/constants";

export const Container = styled.div`
  width: 100%;
  height: ${CONTROL_PANEL_HEIGHT}px;
  border: 1px solid grey;
  border-radius: 0px;
  caret-color: white;
  padding: 8px;
`;

export const Wrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
`;
