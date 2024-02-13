import React, {useRef, useState} from "react";
import './App.css';

function SvgContainer() {
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const [svgContent, setSvgContent] = useState(null)

    const dropAreaRef = useRef(null)
    const svgInputRef = useRef(null)
    const svgResultRef = useRef(null)
    const svgInputDivRef = useRef(null)

    const handleDragEnter = (e) => {
      e.preventDefault();
      setIsDraggingOver(true);
    };
  
    const handleDragLeave = (e) => {
      e.preventDefault();
      setIsDraggingOver(false);
    };
  
    const handleDragOver = (e) => {
      e.preventDefault();
    };
  
    const handleDrop = (e) => {
      e.preventDefault();
      setIsDraggingOver(false);

      // Access files from the data transfer object
      const files = Array.from(e.dataTransfer.files);
      if (files) {
        const reader = new FileReader();

        reader.onload = (e) =>{
            setSvgContent(e.target.result);
        }

        reader.readAsText(files[0])
      }
    };
    return (
        <>
        <div 
            ref={dropAreaRef}
            id='dropArea' 
            className={`lg:w-3/5 md:w-full sm:h-[50%] lg:h-full sm:w-full  p-5 svgDiv ${isDraggingOver ? 'active' : ''}`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave} 
        >
            <div ref={svgInputDivRef} id="drop" style={{ display: svgContent ? 'none' : 'block' }}>
                <p className="mb-3">Drag The File Here</p>
                <input ref={svgInputRef} type="file" name="svg" id="svgInput" placeholder="Choose The SVG File" />
            </div>
            <div ref={svgResultRef} id="result" style={{ opacity: svgContent ? '1' : '0' }}>
                <div id="zoomContainer" dangerouslySetInnerHTML={{ __html: svgContent }}></div>
            </div>
        </div>
        </>
    )
}

export default SvgContainer