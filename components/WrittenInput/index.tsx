import * as THREE from "three";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";

import { Container, Form, TextArea } from "./styled";
import { mixer } from "../../utils/threeConfig";
import { Button } from "../Button";

import type { FormProps } from "./types";

export const WrittenInput = () => {
  const handleSubmit = async (e: React.FormEvent<FormProps>) => {
    e.preventDefault();

    if (
      !process.env.NEXT_PUBLIC_AZURE_KEY ||
      !process.env.NEXT_PUBLIC_AZURE_REGION
    ) {
      return;
    }

    const speechConfig = sdk.SpeechConfig.fromSubscription(
      process.env.NEXT_PUBLIC_AZURE_KEY,
      process.env.NEXT_PUBLIC_AZURE_REGION
    );
    const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput();

    const speechSynthesizer = new sdk.SpeechSynthesizer(
      speechConfig,
      audioConfig
    );

    let timeStep = 1 / 60;
    let timeStamp = 0;

    const times: number[] = [];
    const values: number[] = [];

    speechSynthesizer.visemeReceived = function (s, e) {
      var animation = JSON.parse(e.animation);

      animation.BlendShapes.forEach((blendArray: Array<number>) => {
        values.push(...blendArray.slice(0, 52));
        times.push(timeStamp);
        timeStamp += timeStep;
      });
    };

    const ssml = `
    <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xml:lang="en-US">
      <voice name="en-US-DavisNeural" style='whispering' >
        <mstts:viseme type="FacialExpression"/>
          ${e.currentTarget.textArea.value}
      </voice>
    </speak>`;

    speechSynthesizer.speakSsmlAsync(
      ssml,
      (result) => {
        if (result) {
          const key = "neutral.morphTargetInfluences";
          times.push(times[times.length - 1] + times[1]);
          values.push(...Array.from({ length: 52 }, () => 0));
          const track = new THREE.NumberKeyframeTrack(key, times, values);
          const clip = new THREE.AnimationClip("blink", -1, [track]);

          let animation = mixer.clipAction(clip);

          animation.setLoop(THREE.LoopOnce);
          animation.clampWhenFinished = true;
          animation.enable = true;

          animation.reset().play();

          speechSynthesizer.close();
        }
      },
      (err) => {
        speechSynthesizer.close();
      }
    );
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <label htmlFor="textArea" hidden>
          Input field
        </label>
        <TextArea
          name="Text1"
          id="textArea"
          placeholder="Type your text and the model will repeat it"
        ></TextArea>
        <Button type="submit">Submit</Button>
      </Form>
    </Container>
  );
};
