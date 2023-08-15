import React from "react";
import { ChatMessage } from "../../api/Chat";

interface Message extends ChatMessage {
  fontSize?: string;
}

interface MessagesProps {
  color: string;
  messages: Message[];
}

const Messages = ({ messages, color }: MessagesProps) => {
  const rendered = messages.map((message, index) => {
    const emphasizedMsg = {
      __html: message.content.replace(
        /<(.+?)>/g,
        `<span class='text-${
          message.role === "user" ? "" : color
        }-400'>$1</span>`
      ),
    };
    return (
      <p
        key={index}
        className={`mb-6 break-words ${
          message.role === "user" ? `text-${color}-400` : "text-white"
        } text-${message.fontSize || "xl"}`}
        dangerouslySetInnerHTML={emphasizedMsg}
      />
    );
  });
  return (<>{rendered}</>)
};

export default Messages;
