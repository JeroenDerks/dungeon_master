import React from "react";
import styled from "styled-components";
import { CONTROL_PANEL_HEIGHT } from "../../utils/constants";

export const StyledButton = styled.button`
  border: 1px solid grey;
  cursor: pointer;
  height: ${CONTROL_PANEL_HEIGHT}px;
  width: ${CONTROL_PANEL_HEIGHT}px;
  padding: 0 16px;
  border-radius: 0px;
`;

export const Button = ({
  children,
  onClick,
  type,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "submit";
}) => <StyledButton {...{ type, onClick }}>{children}</StyledButton>;
