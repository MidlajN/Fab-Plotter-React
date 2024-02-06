// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import Display from './Display'
import './index.css'

function App() {

  return (
    <>
      {/* ---------- Navbar ---------- */}
      <nav class="flex justify-center navbar">
        <div class="flex flex-col gap-y-1.5 items-center p-4">
          <img class="w-16" src="/plotter.svg" alt="" />
          <h3>Fab Plotter</h3>
        </div>
      </nav>

      {/* ---------- Main Section ---------- */}
      <div className="flex m-10 h-3/4 items-center">
        <Display />
      </div>
    </>
  )
}

export default App
