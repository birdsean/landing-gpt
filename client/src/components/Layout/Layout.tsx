import React from "react";
import { isiOS } from "../../helpers/helpers";

interface LayoutProps {
    chatBody: JSX.Element
    footer: JSX.Element
}

function Layout(props: LayoutProps) {
  const scrollBoxRef = React.useRef<HTMLDivElement>(null);

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
          {props.chatBody}
        </div>
      </div>
      <div className="flex items-center h-1/6 flex-col p-5 pt-0">
        <div className="max-w-prose w-full">{props.footer}</div>
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

export default Layout;
