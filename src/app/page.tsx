"use client";

import React, { useEffect } from "react";
import { InputController } from "../../components/InputController";
import { PageContainer } from "../../components/PageContainer";
import { initThree } from "../../utils/threeConfig";

export default function Home() {
  useEffect(() => {
    initThree();
  }, []);

  return (
    <main>
      <PageContainer>
        <div id="skecth-container" />
        <InputController />
      </PageContainer>
    </main>
  );
}
