// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import Controls from './Controls'
import './index.css'
import SvgContainer from './svgContainer'
import { useState } from 'react';


function App() {
  const [svgContent, setSvgContent] = useState(null)

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
        <SvgContainer
          svgContent={svgContent}
          setSvgContent={setSvgContent}
        />
        <Controls 
          svgContent={svgContent}
        />
      </div>
    </>
  )
}

export default App
