import React, { useContext } from "react";
import PillManager from "../PillManager/PillManager";
import { ScrollContext } from "../Layout/ScrollContext";

interface MessagingInputsProps {
  color: string;
  hidePills?: boolean;
  disabled?: boolean;
  placeholder?: string;

  sendMessage: (
    text: string,
    scrollBottom: () => void,
    clearInput: () => void
  ) => void;
}

const MessagingInputs = ({
  color,
  sendMessage,
  hidePills,
  placeholder,
  disabled,
}: MessagingInputsProps) => {
  const [placeholderOverride, setPlaceholderOverride] =
    React.useState<string>();

  const scrollBottomMessage = useContext(ScrollContext);

  const messageBoxRef = React.useRef<HTMLInputElement>(null);
  const formRef = React.useRef<HTMLFormElement>(null);

  const overrideSendMessage = (text: string) => {
    sendMessage(text, scrollBottomMessage, clearInput);
    if (placeholderOverride) {
      setPlaceholderOverride(undefined);
    }
  };

  const clearInput = () => (messageBoxRef.current!.value = "");

  // when text box is active and user presses enter, send message
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if (messageBoxRef.current!.value === "") return;
        overrideSendMessage(messageBoxRef.current!.value);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  // on form submit, send message
  React.useEffect(() => {
    const handleSubmit = (event: Event) => {
      event.preventDefault();
      if (messageBoxRef.current!.value === "") return;
      overrideSendMessage(messageBoxRef.current!.value);
    };
    formRef.current!.addEventListener("submit", handleSubmit);
    return () => {
      formRef.current?.removeEventListener("submit", handleSubmit);
    };
  });

  const renderPills = () => {
    if (hidePills) return null;

    return (
      <PillManager
        color={color}
        sendMessage={overrideSendMessage}
        disabled={disabled}
        onClickJoinWaitlist={onClickJoinWaitlist}
      />
    );
  };

  const onClickJoinWaitlist = () => {
    setPlaceholderOverride("Enter your email here to join the waitlist!");
  };

  return (
    <>
      {renderPills()}
      <form
        className="w-full h-1/2 outline outline-1 outline-white rounded flex flex-row"
        ref={formRef}
      >
        <input
          className={`bg-black caret-${color}-400 text-${color}-400 p-3 w-5/6 m-0 resize-none`}
          placeholder={
            placeholderOverride || placeholder || "Enter a message to start..."
          }
          type="text"
          enterKeyHint="send"
          ref={messageBoxRef}
        />
        <button
          className={`bg-${color}-400 p-3 w-1/6`}
          formAction="submit"
          disabled={disabled}
        >
          Send
        </button>
      </form>
    </>
  );
};

export default MessagingInputs;
