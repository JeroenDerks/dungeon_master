import React from "react";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";

import { Container, Wrapper } from "./styled";
import { Button } from "../Button";

export const VoiceInput = () => {
  const [text, setText] = React.useState("speak into your microphone...");

  const sttFromMic = async () => {
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
    speechConfig.speechRecognitionLanguage = "en-US";

    const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
    const speechRecognizer = new sdk.SpeechRecognizer(
      speechConfig,
      audioConfig
    );
    speechRecognizer.recognizing = (s, e) => {
      console.log(`RECOGNIZING: Text=${e.result.text}`);
    };

    speechRecognizer.recognized = (s, e) => {
      if (e.result.reason == sdk.ResultReason.RecognizedSpeech) {
        console.log(`RECOGNIZED: Text=${e.result.text}`);
        setText(e.result.text);
      } else if (e.result.reason == sdk.ResultReason.NoMatch) {
        console.log("NOMATCH: Speech could not be recognized.");
        setText("Sorry, we did not recognize your text");
      }
    };

    speechRecognizer.canceled = (s, e) => {
      console.log(`CANCELED: Reason=${e.reason}`);

      if (e.reason == sdk.CancellationReason.Error) {
        console.log(`"CANCELED: ErrorCode=${e.errorCode}`);
        console.log(`"CANCELED: ErrorDetails=${e.errorDetails}`);
        console.log(
          "CANCELED: Did you set the speech resource key and region values?"
        );
        setText("Please talk into the mic");
      }

      speechRecognizer.stopContinuousRecognitionAsync();
    };

    speechRecognizer.sessionStopped = (s, e) => {
      console.log("\n    Session stopped event.");
      speechRecognizer.stopContinuousRecognitionAsync();
    };

    speechRecognizer.startContinuousRecognitionAsync();
  };

  return (
    <Wrapper>
      <Container>
        <p>{text}</p>
      </Container>
      <Button onClick={sttFromMic}>Enable mic</Button>
    </Wrapper>
  );
};
