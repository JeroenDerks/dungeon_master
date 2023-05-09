"use client";

import React, { useRef, useEffect } from "react";
import { Input } from "../../components/Input";
import { initThree } from "../../utils/threeConfig";

export default function Home() {
  const ref = useRef(null);

  useEffect(() => {
    initThree();
  }, []);

  return (
    <main>
      <div ref={ref}></div>
      <Input />
    </main>
  );
}
