"use client";

import React from "react";

import { Wrapper, Container } from "./styled";

export const PageContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <Wrapper>
      <Container>{children}</Container>
    </Wrapper>
  );
};
