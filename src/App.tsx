import React from 'react';

const COLORS = [
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'indigo',
  'purple',
  'cyan',
  'pink',
  'teal',
  'zinc',
  'rose',
]
const COLOR = COLORS[Math.floor(Math.random() * COLORS.length)]

interface Message {
  text: string,
  isUser: boolean
  fontSize?: string
}

function App() {
  const [messages, setMessages] = React.useState<Message[]>([
    {text: 'Hi!', isUser: false, fontSize: '5xl'},
    {text: 'I\'m an AI chat assistant here to introduce <Product>', isUser: false, fontSize: '5xl'},
  ])

  const messageBoxRef = React.useRef<HTMLTextAreaElement>(null)
  const scrollBoxRef = React.useRef<HTMLDivElement>(null)

  const renderMessages = () => {
    return messages.map((message, index) => {
      const emphasizedMsg = {__html: message.text.replace(/<(.+?)>/g, `<span class=\'text-${message.isUser ? '' : COLOR}-400\'>$1</span>`)}
      return (
        <p key={index} className={`mb-6 break-words ${message.isUser ? `text-${COLOR}-400` : 'text-white'} text-${message.fontSize || 'xl'}`} dangerouslySetInnerHTML={emphasizedMsg}/>
      )
    })}

  const sendMessage = () => {
    const message = messageBoxRef.current?.value
    if (message) {
      setMessages([...messages, {text: message, isUser: true}])
      messageBoxRef.current!.value = ''

      // the extra ! is to tell typescript that we know this will never be null
      setTimeout(() => {
        scrollBoxRef.current!.scrollTop = scrollBoxRef.current!.scrollHeight
      }, 0)
    }
  }

  // when text box is active and user presses enter, send message
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault()
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
      <div className='relative flex flex-col h-5/6 leading-tight'>
        <div className='absolute bottom-0 h-full overflow-y-auto overflow-x-hidden w-full' ref={scrollBoxRef}>
          {renderMessages()}
        </div>
      </div>
      <div className='relative h-1/6 flex flex-col'>
        <div className='flex flex-row leading-none mb-5 text-sm'>
          <button className={`rounded-full bg-${COLOR}-400 p-1 m-2 px-2 outline-white`}>What's Product?</button>
          <button className={`rounded-full bg-${COLOR}-400 p-1 m-2 px-2 outline-white`}>How does this work?</button>
          <button className={`rounded-full bg-${COLOR}-400 p-1 m-2 px-2 outline-white`}>Who are you?</button>
        </div>
        <div className='w-full h-1/2 outline outline-white flex flex-row'>
          <textarea 
            className={`bg-black caret-${COLOR}-400 text-${COLOR}-400 p-3 w-5/6 m-0`} 
            placeholder='Enter a message to start...'
            ref={messageBoxRef}
          />
          <button 
            className={`bg-${COLOR}-400 p-3 w-1/6`}
            onClick={sendMessage}
          >Send</button>
        </div>
      </div>
      <span className='text-red-400 bg-red-400'/>
      <span className='text-orange-400 bg-orange-400'/>
      <span className='text-yellow-400 bg-yellow-400'/>
      <span className='text-green-400 bg-green-400'/>
      <span className='text-blue-400 bg-blue-400'/>
      <span className='text-indigo-400 bg-indigo-400'/>
      <span className='text-purple-400 bg-purple-400'/>
      <span className='text-cyan-400 bg-cyan-400'/>
      <span className='text-pink-400 bg-pink-400'/>
      <span className='text-teal-400 bg-teal-400'/>
      <span className='text-zinc-400 bg-zinc-400'/>
      <span className='text-rose-400 bg-rose-400'/>
    </div>
  );
}

export default App;
