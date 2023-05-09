import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { uploadToStorage } from "./uploadToStorage";

let SSML = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xml:lang="en-US">
<voice name="en-US-DavisNeural" style='whispering'>
  <mstts:viseme type="FacialExpression"/>
  __TEXT__
</voice>
</speak>`;

const key = process.env.AZURE_KEY;
const region = process.env.AZURE_REGION;

export const getViseme = async ({ userInput }: { userInput: string }) => {
  if (!key || !region) {
    return false;
  }

  return new Promise((resolve, reject) => {
    let ssml = SSML.replace("__TEXT__", userInput);
    const speechConfig = sdk.SpeechConfig.fromSubscription(key!, region!);
    speechConfig.speechSynthesisOutputFormat = 5; // mp3

    const randomString = Math.random().toString(36).slice(2, 7);
    const filename = `./public/audio/speech-${randomString}.mp3`;
    const audioConfig = sdk.AudioConfig.fromAudioFileOutput(filename);

    let timeStep = 1 / 60;
    let timeStamp = 0;

    let synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);
    // Subscribes to viseme received event
    synthesizer.visemeReceived = function (s, e) {
      var animation = JSON.parse(e.animation);

      const blendData = animation.BlendShapes.map(
        (blendShapes: Array<number>) => {
          const data = { timeStamp, blendShapes };
          timeStamp += timeStep;
          return data;
        }
      );

      resolve({ blendData, filename: `audio/speech-${randomString}.mp3` });
    };
    synthesizer.speakSsmlAsync(ssml);
  });
};
