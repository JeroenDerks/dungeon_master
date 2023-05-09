import axios from "axios";

import { Container, Button, Form } from "./styled";
import type { FormProps } from "./types";

export const Input = () => {
  const handleSubmit = async (e: React.FormEvent<FormProps>) => {
    e.preventDefault();

    const req = await axios.post("/api/textToSpeech", {
      headers: { "Content-Type": "application/json" },
      userInput: e.currentTarget.textArea.value,
    });

    console.log(req);

    if (req.status === 200) {
      console.log(req.data);
      const audio = new Audio("/" + req.data.filename);
      audio.load();
      audio.play();
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
