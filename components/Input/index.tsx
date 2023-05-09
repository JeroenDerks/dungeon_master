import axios from "axios";
import * as THREE from "three";

import { Container, Button, Form } from "./styled";
import { blendShapeToAnimation } from "../../utils/blendShapeToAnimation";
import type { FormProps } from "./types";
import { BlendData } from "../../utils/types";
import { mixer } from "../../utils/threeConfig";

export const Input = () => {
  const handleSubmit = async (e: React.FormEvent<FormProps>) => {
    e.preventDefault();

    const req = await axios.post("/api/textToSpeech", {
      headers: { "Content-Type": "application/json" },
      userInput: e.currentTarget.textArea.value,
    });

    if (req.status === 200) {
      const blendData: BlendData = req.data.blendData;
      console.log(req.data);
      const clip = blendShapeToAnimation(blendData);

      console.log("clip", clip);
      const audio = new Audio(
        req.data.rawData.replace("data:;", "data:audio/mpeg;")
      );
      audio.load();
      audio.play();

      let animation = mixer.clipAction(clip);
      animation.setLoop(THREE.LoopOnce);
      animation.clampWhenFinished = true;
      animation.enable = true;

      animation.reset().play();
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <label htmlFor="textArea" hidden>
          Input field
        </label>
        <textarea name="Text1" cols={40} rows={5} id="textArea"></textarea>
        <Button type="submit">Submit</Button>
      </Form>
    </Container>
  );
};
