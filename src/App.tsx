import React from 'react';

function App() {
  return (
    <div className="fixed w-full h-full p-5 bg-gradient-to-br from-black to-slate-800">
      <div className='relative flex flex-col h-5/6 text-white text-5xl leading-tight'>
        <h1 className='mb-6'>Hi!</h1>
        <h1>I'm an AI chat assistant here to introduce <span className='text-blue-400'>Product</span></h1>
      </div>
      <div className='relative h-1/6 flex flex-col'>
        <div className='flex flex-row leading-none mb-5 text-sm'>
          <button className='rounded-full bg-blue-400 p-1 m-2 outline-white'>What's Product?</button>
          <button className='rounded-full bg-blue-400 p-1 m-2 outline-white'>How does this work?</button>
          <button className='rounded-full bg-blue-400 p-1 m-2 outline-white'>Who are you?</button>
        </div>
        <div className='w-full h-1/2 outline outline-white flex flex-row'>
          <textarea className='bg-black caret-blue-400 text-blue-400 p-3 w-5/6 m-0' placeholder='Enter a message to start...'></textarea>
          <button className='bg-blue-400 p-3 w-1/6'>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
