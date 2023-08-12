import React from "react";
import Chat, { ChatMessage } from "./api/Chat";
import { isiOS } from "./helpers/helpers";
import PillManager from "./components/PillManager/PillManager";
import { COLORS, PRODUCT_NAME } from "./helpers/variables";
import Messages from "./components/Chat/Messages";
import MessagingInputs from "./components/Chat/MessagingInputs";


const COLOR = COLORS[Math.floor(Math.random() * COLORS.length)];

interface Message extends ChatMessage {
  fontSize?: string;
}

function App() {
  const [messages, setMessages] = React.useState<Message[]>([
    { content: "Hi!", role: "assistant", fontSize: "5xl" },
    {
      content: `I'm an AI chat assistant here to introduce <${PRODUCT_NAME}>`,
      role: "assistant",
      fontSize: "5xl",
    },
  ]);

  
  const scrollBoxRef = React.useRef<HTMLDivElement>(null);

  const appendCompletionToLastMessage = (completion: string) => {
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
      scrollBoxRef.current!.scrollTop = scrollBoxRef.current!.scrollHeight;
    }, 0);
  };

  const sendMessage = async (text: string, clearInput: () => void) => {
    const updatedChat: Message[] = [
      ...messages,
      { content: text, role: "user" },
    ];
    setMessages(updatedChat);
    setTimeout(() => {
      scrollBoxRef.current!.scrollTop = scrollBoxRef.current!.scrollHeight;
    }, 0);

    clearInput();
    const requestBody = updatedChat.map((msg): ChatMessage => {
      return { content: msg.content, role: msg.role };
    });
    setMessages([...updatedChat, { content: "", role: "assistant" }]); // must append blank assistant message to end of array before starting completion
    await Chat.getCompletion(requestBody, appendCompletionToLastMessage);

    setTimeout(() => {
      scrollBoxRef.current!.scrollTop = scrollBoxRef.current!.scrollHeight;
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

  return (
    <div className="absolute bottom-0 w-full p-0 bg-gradient-to-br from-black to-slate-800 min-h-screen flex flex-col">
      <div className="fixed top-0 w-full h-1/6 bg-gradient-to-b from-black to-transparent z-10" />
      <div className="relative flex flex-col h-5/6 leading-tight items-center flex-grow h-px">
        <div
          className="w-full max-w-prose overflow-y-auto p-5 pb-0"
          ref={scrollBoxRef}
        >
          <p className="h-20" />
          {
            isiOS() ? (
              <p className="h-20" />
            ) : null /* no idea why, but my iPhone needs a second buffer */
          }
          <Messages messages={messages} color={COLOR}/>
        </div>
      </div>
      <div className="flex items-center h-1/6 flex-col p-5 pt-0">
        <div className="max-w-prose w-full">
          <MessagingInputs sendMessage={sendMessage} color={COLOR} />
        </div>
      </div>
      <div className="invisible">
        <span className="text-red-400 bg-red-400" />
        <span className="text-orange-400 bg-orange-400" />
        <span className="text-yellow-400 bg-yellow-400" />
        <span className="text-green-400 bg-green-400" />
        <span className="text-blue-400 bg-blue-400" />
        <span className="text-indigo-400 bg-indigo-400" />
        <span className="text-purple-400 bg-purple-400" />
        <span className="text-cyan-400 bg-cyan-400" />
        <span className="text-pink-400 bg-pink-400" />
        <span className="text-teal-400 bg-teal-400" />
        <span className="text-zinc-400 bg-zinc-400" />
        <span className="text-rose-400 bg-rose-400" />
        <span className="text-5xl" />
      </div>
    </div>
  );
}

export default App;
