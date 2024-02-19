import { useState, useEffect } from 'react';
import './Controls.css'
import { DirectionButtons, SerialButtons } from './ControlButtons';
import { Converter } from 'svg-to-gcode';

function Controls({svgContent}) {
    const [reader, setReader] = useState(null)
    const [writer, setWriter] = useState(null)
    const [port, setPort] = useState(null)
    const [response, setResponse] = useState('')
    const [configuration, setConfiguration] = useState({ feedRate:1400, seekRate:1100, zOffset:4 })
    const [gcode, setGcode] = useState('')

    const generateGcode = () =>{
        const converter = new Converter(configuration)

        converter.convert(svgContent).then((gcodes) => {
            setGcode(gcodes[0])
        })
    }

    return (
        <>
            <div className="flex flex-wrap justify-between md:items-center lg:items-start md:w-full sm:w-full lg:w-2/5 h-full">
                <div className="w-full p-3">
                    <div className="flex items-center lg:h-1/3 max-[646px]:h-full max-[646px]:flex-col">
                        <div className="flex gap-5 p-3 flex-wrap w-3/5 max-[646px]:w-full">
                            <SerialButtons 
                                port={port} setPort={setPort}
                                reader={reader} setReader={setReader}
                                writer={writer} setWriter={setWriter}
                                setResponse={setResponse}
                            />

                            <PlotterConfiguration 
                                configuration={configuration}
                                setConfiguration={setConfiguration}
                            />

                            <div className="flex justify-between items-center w-full">
                                <button className="generateGcode" id="generateGcode" onClick={generateGcode}><i className="fa-solid fa-gears"></i> Generate G-Code</button>  
                                <button className="plot" id="sendSerial">Send <i className="fa-solid fa-print fa-sm"></i></button>
                            </div>
                        </div>

                        <div className="w-2/5">
                            <DirectionButtons />
                        </div>
                    </div>
                </div>
                <div className='textareaGroup w-full lg:h-3/5'>
                    <GcodeSection 
                        response={response}
                        setResponse={setResponse}
                        gcodeData={gcode}
                    />
                </div>
            </div>
        </>
    )
}


function PlotterConfiguration({configuration, setConfiguration}) {
    const handleInput = (event) => {
        if (event.target.value) {
            console.log('Old CONF :::', configuration)
            const { name, value } = event.target;
            setConfiguration(prevConfig => ({
                ...prevConfig,
                [name]: value
            }));
        }
    }
    
    useEffect(() => {
        console.log('New CONF :::', configuration);
    }, [configuration]); // Add configuration as a dependency


    return (
        <>
            <div className="flex controlInputGroup">
                <div className="flex items-center justify-between">
                    <label htmlFor="feedRate">feedRate</label>
                    <input onInput={handleInput} type="number" max="9999" min="0" name='feedRate' maxLength="4" placeholder="1400" />
                </div>
                <div className="flex items-center justify-between">
                    <label htmlFor="seekRate">seekRate</label>
                    <input onInput={handleInput} type="number" max="9999" min="0" name='seekRate' maxLength="4" placeholder="1100" disabled/>
                </div>
                <div className="flex items-center justify-between">
                    <label htmlFor="zOffset">zOffset</label>
                    <input onInput={handleInput} type="number" max="9" name='zOffset' maxLength="1" placeholder="4" disabled/>
                </div>
            </div>
        </>
    )
}

async function logSerialData(reader, setResponse) {
    try {
        const readerResult = await reader.read();
        // const receivedChunks = [];
        // receivedChunks.push(new TextDecoder().decode(readerResult.value));
        let recdata = new TextDecoder().decode(readerResult.value)
        // const receivedData = receivedChunks.join('');
        setResponse(prevData => prevData + recdata)
    } catch (error) {
        console.error('Error Fetching Data:', error);
    }
}


function GcodeSection(props) {
    const [text, setText] = useState('Baby Tell Me Why')

    const downloadGcode = () => {
        const gcodeFile = new Blob([props.gcodeData], { type : 'text/plain' })
        const link = document.createElement('a');
        link.href = URL.createObjectURL(gcodeFile);
        link.download = 'G-Code-OutPut.gcode';
        link.click();
        URL.revokeObjectURL(link.href)
    }
    
    return (
        <>
            <div className="flex gap-6 h-full">
                <div className='w-full'>
                    <div className="textArea h-full">
                        <div className="flex justify-between items-center p-6 h-[10%]">
                            <h1>G - Code</h1>
                            <button onClick={downloadGcode}><i className="fa-solid fa-download fa-lg" style={{color: '#3A5A99'}}></i></button>
                        </div>
                        <textarea name="gcode" className='h-[90%]' id="gcode" value={props.gcodeData}></textarea>
                    </div>
                </div>
                <div className='w-full'>
                    <div className="responseArea h-full">
                        <div className='flex items-center p-6 h-[10%]'>
                            <h1>Response</h1>
                        </div>
                        <textarea name="responseArea" className='h-[90%] w-full' id="responseArea" disabled value={props.response}></textarea>
                    </div>
                </div>
            </div>
        </>
    )
}



export { logSerialData }
export default Controls