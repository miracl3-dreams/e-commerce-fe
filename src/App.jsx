import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="bg-slate-600 h-screen w-full">
        <nav className='bg-slate-400 flex justify-between items-center flex-row px-5 py-5'>
        <h1 className="text-3xl font-bold text-red-500">
          Hello world!
        </h1>
        <ul className='flex flex-row gap-4 '>
          <li>About</li>
          <li>Contact</li>
        </ul> 
        </nav>
      </div>
    </>
  )
}

export default App
