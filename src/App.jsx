// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import Controls from './Controls'
import Display from './Display'
import './index.css'
// 
function App() {

  return (
    <>
      {/* ---------- Navbar ---------- */}
      <nav className="flex justify-center navbar">
        <div className="flex flex-col gap-y-1.5 items-center p-4">
          <img className="w-16" src="/plotter.svg" alt="" />
          <h3>Fab Plotter</h3>
        </div>
      </nav>

      {/* ---------- Main Section ---------- */}
      <div className="flex items-center m-10 sm:flex-col md:flex-col lg:flex-row h-3/4 max-[646px]:flex-col">
        <Display />
        <Controls />
      </div>
    </>
  )
}

export default App
