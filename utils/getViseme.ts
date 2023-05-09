import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { azureVisemeKeys } from "./azureVisemes";
import { BlendData } from "./types";

let SSML = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xml:lang="en-US">
<voice name="en-US-DavisNeural" style='whispering'>
  <mstts:viseme type="FacialExpression"/>
  __TEXT__
</voice>
</speak>`;

const key = process.env.AZURE_KEY;
const region = process.env.AZURE_REGION;

export const getViseme = async ({
  userInput,
}: {
  userInput: string;
}): Promise<
  { blendData: BlendData; filename?: string; rawData: ArrayBuffer } | false
> => {
  if (!key || !region) {
    return false;
  }

  return new Promise((resolve, reject) => {
    let ssml = SSML.replace("__TEXT__", userInput);
    const speechConfig = sdk.SpeechConfig.fromSubscription(key!, region!);
    speechConfig.speechSynthesisOutputFormat = 5; // mp3

    let timeStep = 1 / 60;
    let timeStamp = 0;

    let synthesizer = new sdk.SpeechSynthesizer(speechConfig);
    let blendData: BlendData = [];

    synthesizer.synthesisCompleted = (s, e) => {
      console.log(e.result.audioData);
      resolve({ blendData, rawData: e.result.audioData });
    };

    synthesizer.visemeReceived = function (s, e) {
      var animation = JSON.parse(e.animation);

      animation.BlendShapes.forEach((blendArray: Array<number>) => {
        let blend: any = {};
        azureVisemeKeys.forEach((shapeName, i) => {
          blend[shapeName] = blendArray[i];
        });

        blendData.push({ timeStamp, blendShapes: blend });
        timeStamp += timeStep;
      });
    };
    synthesizer.speakSsmlAsync(ssml);
  });
};
