import styled from "styled-components";
import { CONTROL_PANEL_HEIGHT } from "../../utils/constants";

export const Container = styled.div`
  display: flex;
  width: 100%;
`;

export const Form = styled.form`
  display: flex;
  width: 100%;
`;

export const TextArea = styled.input`
  width: 100%;
  height: ${CONTROL_PANEL_HEIGHT}px;
  border: 1px solid grey;
  border-radius: 0px;
  caret-color: white;
  padding: 8px;
  background-color: #000;

  outline: none;

  ::placeholder {
    font-size: 14px;
    color: lightgrey;
  }
`;
