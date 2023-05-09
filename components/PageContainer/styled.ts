import styled from "styled-components";
import { PAGE_PADDING } from "../../utils/constants";

export const Wrapper = styled.div`
  padding: ${PAGE_PADDING}px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Container = styled.div`
  border: 1px solid grey;
`;
