import React from "react";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";

import { Container, Copy, Wrapper } from "./styled";
import { Button } from "../Button";

export const VoiceInput = () => {
  const [text, setText] = React.useState(
    "Enable your microphone and start talking"
  );
  const [micEnabled, setMicEnabled] = React.useState(false);

  let speechRecognizer: any;
  const key = process.env.NEXT_PUBLIC_AZURE_KEY;
  const region = process.env.NEXT_PUBLIC_AZURE_REGION;

  if (!key || !region) {
    setText("Oops, there was an error from our side");
  }

  const speechConfig = sdk.SpeechConfig.fromSubscription(key!, region!);
  speechConfig.speechRecognitionLanguage = "en-US";

  const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
  speechRecognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
  speechRecognizer.recognizing = (s: any, e: any) => {
    console.log(`RECOGNIZING: Text=${e.result.text}`);
  };

  speechRecognizer.recognized = (s: any, e: any) => {
    if (e.result.reason == sdk.ResultReason.RecognizedSpeech) {
      console.log(`RECOGNIZED: Text=${e.result.text}`);
      setText(e.result.text);
    } else if (e.result.reason == sdk.ResultReason.NoMatch) {
      console.log("NOMATCH: Speech could not be recognized.");
      setText("Sorry, we did not recognize your text");
    }
  };

  speechRecognizer.canceled = (s: any, e: any) => {
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

  speechRecognizer.sessionStopped = (s: any, e: any) => {
    console.log("\n    Session stopped event.");
    speechRecognizer.stopContinuousRecognitionAsync();
  };

  const handleMicToggle = () => {
    if (micEnabled) {
      speechRecognizer.stopContinuousRecognitionAsync();
    } else {
      speechRecognizer.startContinuousRecognitionAsync();
    }
  };

  return (
    <Wrapper>
      <Container>
        <Copy>{text}</Copy>
      </Container>
      <Button onClick={handleMicToggle}>
        {micEnabled ? "Mic is on" : "Enable mic"}
      </Button>
    </Wrapper>
  );
};
