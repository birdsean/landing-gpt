import React from "react";
import Chat, { ChatMessage } from "../api/Chat";
import { COLORS, EMOJIS } from "../helpers/variables";
import Messages from "../components/Chat/Messages";
import MessagingInputs from "../components/Chat/MessagingInputs";
import Layout from "../components/Layout/Layout";
import { Helmet } from "react-helmet";

export interface Message extends ChatMessage {
  fontSize?: string;
}

const COLOR = COLORS[Math.floor(Math.random() * COLORS.length)];
const EMOJI = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];

function AdminPage() {
  const [productName, setProductName] = React.useState<string>("");
  const [systemMessage, setSystemMessage] = React.useState<string>("");
  const [messages, setMessages] = React.useState<Message[]>([
    { content: "Hi!", role: "assistant", fontSize: "5xl" },
    {
      content: `I'm an AI chat assistant here to introduce <[product name]>`,
      role: "assistant",
      fontSize: "5xl",
    },
  ]);

  const appendCompletionToLastMessage = (
    completion: string,
    onAppend: () => void
  ) => {
    setTimeout(() => {
      setMessages((prevState) => {
        const lastMessage = prevState[prevState.length - 1];
        return [
          ...prevState.slice(0, prevState.length - 1),
          {
            ...lastMessage,
            content: `${lastMessage.content}${completion}`,
            fontSize: "xl",
          },
        ];
      });
      onAppend();
    }, 0);
  };

  const sendMessage = async (
    text: string,
    scrollBottom: () => void,
    clearInput: () => void
  ) => {
    const updatedChat: Message[] = [
      ...messages,
      { content: text, role: "user" },
    ];
    setMessages(updatedChat);
    setTimeout(() => {
      scrollBottom();
    }, 0);

    clearInput();
    const requestBody = updatedChat.map((msg): ChatMessage => {
      return { content: msg.content, role: msg.role };
    });
    setMessages([...updatedChat, { content: "", role: "assistant" }]); // must append blank assistant message to end of array before starting completion

    // if system message is not empty, append it to front of requestBody array
    if (systemMessage) {
      requestBody.unshift({ content: systemMessage, role: "system" });
    }

    await Chat.getCompletion(requestBody, (completion: string) =>
      appendCompletionToLastMessage(completion, scrollBottom)
    );

    setTimeout(() => {
      scrollBottom();
    }, 100);
  };

  React.useEffect(() => {
    // scroll to bottom of scrollBoxRef on focusout
    const handleFocusOut = () => {
      window.scrollTo(0, 0);
    };
    document.addEventListener("focusout", handleFocusOut);
    return () => {
      document.removeEventListener("focusout", handleFocusOut);
    };
  });

  // if productName is not empty, replace <[product name]> with productName
  React.useEffect(() => {
    if (productName) {
      setMessages((prevState) => {
        const lastMessage = prevState[prevState.length - 1];
        return [
          ...prevState.slice(0, prevState.length - 1),
          {
            ...lastMessage,
            content: lastMessage.content.replace(
              "<[product name]>",
              `<${productName}>`
            ),
          },
        ];
      });
    }
  }, [productName]);

  return (
    <>
      <Helmet>
        <title>{productName}</title>
        <link rel="icon" href={`data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${EMOJI}</text></svg>`}/>
      </Helmet>
      <Layout
        chatBody={
          <>
            <p className="text-white">{systemMessage}</p>
            <Messages messages={messages} color={COLOR} />
          </>
        }
        footer={
          <>
            {!productName ? (
              <MessagingInputs
                sendMessage={(text) => setProductName(text)}
                color={COLOR}
                hidePills={true}
                placeholder="Enter product name..."
              />
            ) : (
              React.Fragment
            )}
            {!systemMessage ? (
              <MessagingInputs
                sendMessage={(text) => setSystemMessage(text)}
                color={COLOR}
                hidePills={true}
                placeholder="Enter system message..."
              />
            ) : (
              React.Fragment
            )}
            <MessagingInputs
              sendMessage={sendMessage}
              color={COLOR}
              hidePills={true}
              placeholder="Enter conversation message(s)..."
            />
          </>
        }
      />
    </>
  );
}

export default AdminPage;
