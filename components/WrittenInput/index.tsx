import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import * as THREE from "three";

import { Container, Form, TextArea } from "./styled";
import { blendShapeToAnimation } from "../../utils/blendShapeToAnimation";
import { BlendData } from "../../utils/types";
import { mixer } from "../../utils/threeConfig";
import { azureVisemeKeys } from "../../utils/azureVisemes";
import { Button } from "../Button";

import type { FormProps } from "./types";

export const WrittenInput = () => {
  const handleSubmit = async (e: React.FormEvent<FormProps>) => {
    e.preventDefault();

    const speechConfig = sdk.SpeechConfig.fromSubscription(
      "d61baa9736ca414ca9eeaa420c8dc176",
      "westeurope"
    );
    const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput();

    const speechSynthesizer = new sdk.SpeechSynthesizer(
      speechConfig,
      audioConfig
    );

    const ssml = `
    <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xml:lang="en-US">
      <voice name="en-US-DavisNeural" style='whispering'>
        <mstts:viseme type="FacialExpression"/>
          ${e.currentTarget.textArea.value}
      </voice>
    </speak>`;

    speechSynthesizer.speakSsmlAsync(
      ssml,
      (result) => {
        if (result) {
          speechSynthesizer.close();
        }
      },
      (err) => {
        speechSynthesizer.close();
      }
    );

    let blendData: BlendData = [];
    let timeStep = 1 / 60;
    let timeStamp = 0;
    speechSynthesizer.visemeReceived = function (s, e) {
      var animation = JSON.parse(e.animation);

      animation.BlendShapes.forEach((blendArray: Array<number>) => {
        let blend: any = {};
        azureVisemeKeys.forEach((shapeName, i) => {
          blend[shapeName] = blendArray[i];
        });

        blendData.push({ timeStamp, blendShapes: blend });
        timeStamp += timeStep;

        const clip = blendShapeToAnimation(blendData);
        let animation = mixer.clipAction(clip);
        animation.setLoop(THREE.LoopOnce);
        animation.clampWhenFinished = true;
        animation.enable = true;

        animation.reset().play();
      });
    };
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
          placeholder="Type your text"
        ></TextArea>
        <Button type="submit">Submit</Button>
      </Form>
    </Container>
  );
};
