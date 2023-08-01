import React from 'react';

function App() {
  const [messages, setMessages] = React.useState<string[]>([
    'Hi!',
    'I\'m an AI chat assistant here to introduce <Product>'
  ])

  const messageBoxRef = React.useRef<HTMLTextAreaElement>(null)

  const renderMessages = () => {
    return messages.map((message, index) => {
      // replace <> with <span className='text-blue-400'></span> jsx
      const emphasizedMsg = {__html: message.replace(/<(.+?)>/g, '<span class=\'text-blue-400\'>$1</span>')}
      return (
        <p key={index} className='mb-6' dangerouslySetInnerHTML={emphasizedMsg}/>
      )
    })}

  const sendMessage = () => {
    const message = messageBoxRef.current?.value
    if (message) {
      setMessages([...messages, message])
      messageBoxRef.current!.value = ''

      // scroll text area to bottom
      console.log(messageBoxRef.current!.scrollHeight, messageBoxRef.current!.scrollTop)
      messageBoxRef.current.setAttribute('scrolltop', '67')
      console.log(messageBoxRef.current!.scrollHeight, messageBoxRef.current!.scrollTop)
    }
  }

  // when text box is active and user presses enter, send message
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        sendMessage()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  })

  return (
    <div className="fixed w-full h-full p-5 bg-gradient-to-br from-black to-slate-800">
      <div className='fixed top-0 w-full h-1/6 bg-gradient-to-b from-black to-transparent z-10'/>
      <div className='relative flex flex-col h-5/6 text-white text-5xl leading-tight'>
        <div className='absolute bottom-0 h-full overflow-y-auto overflow-x-hidden w-full'>
          {renderMessages()}
        </div>
      </div>
      <div className='relative h-1/6 flex flex-col'>
        <div className='flex flex-row leading-none mb-5 text-sm'>
          <button className='rounded-full bg-blue-400 p-1 m-2 px-2 outline-white'>What's Product?</button>
          <button className='rounded-full bg-blue-400 p-1 m-2 px-2 outline-white'>How does this work?</button>
          <button className='rounded-full bg-blue-400 p-1 m-2 px-2 outline-white'>Who are you?</button>
        </div>
        <div className='w-full h-1/2 outline outline-white flex flex-row'>
          <textarea 
            className='bg-black caret-blue-400 text-blue-400 p-3 w-5/6 m-0' 
            placeholder='Enter a message to start...'
            ref={messageBoxRef}
          />
          <button 
            className='bg-blue-400 p-3 w-1/6'
            onClick={sendMessage}
          >Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
