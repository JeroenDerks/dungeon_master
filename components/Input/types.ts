interface FormElements extends HTMLFormControlsCollection {
  textArea: HTMLTextAreaElement;
}

export interface FormProps extends HTMLFormElement {
  readonly elements: FormElements;
}
