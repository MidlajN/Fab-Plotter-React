import React, {useRef, useState} from "react";
import { TransformWrapper,TransformComponent } from "react-zoom-pan-pinch";
import './App.css';

function SvgContainer() {
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const [svgContent, setSvgContent] = useState(null)
    const [errorMsg, setErrorMsg] = useState('')

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

      // Access files from the data transfer object or using the input file field
      const files = e.dataTransfer ? Array.from(e.dataTransfer.files) : e.target.files;
      if (files[0].type === 'image/svg+xml') {
        setErrorMsg('')
        const reader = new FileReader();

        reader.onload = (e) =>{
            setSvgContent(e.target.result);
        }
        reader.readAsText(files[0])
      } else {
        setErrorMsg('Not An SVG File')
        setTimeout(() => {
            setErrorMsg('')
        }, 3000);
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
            <div className={`error-message ${errorMsg ? '' : 'hidden'}`}><span>{errorMsg}</span></div>
            <div ref={svgInputDivRef} id="drop" style={{ display: svgContent ? 'none' : 'block' }}>
                <p className="mb-3">Drag The File Here</p>
                <input ref={svgInputRef} type="file" name="svg" id="svgInput" placeholder="Choose The SVG File" onChange={handleDrop} />
            </div>
            <div ref={svgResultRef} id="result" style={{opacity: svgContent ? '1' : '0', width: svgContent ? '100%' : 'auto', height: svgContent ? '100%' : 'auto'}}>
                <TransformWrapper 
                    initialScale={1} 
                    minScale={.5} 
                    limitToBounds={false }
                >
                    <TransformComponent 
                        contentStyle={{  margin:'auto'}} 
                        wrapperStyle={{ width: '100%', height: '100%', overflow:'visible', display:'flex'}} 
                    >
                        <div id="zoomContainer" style={{width: '100%'}} dangerouslySetInnerHTML={{ __html: svgContent }}></div> 
                    </TransformComponent>
                </TransformWrapper>
            </div>
        </div>
        </>
    )
}

export default SvgContainer