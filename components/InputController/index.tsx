import { Container } from "./styled";
import { WrittenInput } from "../WrittenInput";
import { VoiceInput } from "../VoiceInput";

export const InputController = () => {
  return (
    <Container>
      <WrittenInput />
      <VoiceInput />
    </Container>
  );
};
