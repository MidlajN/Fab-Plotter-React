import { useState, useEffect } from 'react';
import './Controls.css'

function Controls() {
    const [reader, setReader] = useState(null)
    const [writer, setWriter] = useState(null)
    const [port, setPort] = useState(null)

    const [configuration, setConfiguration] = useState({ feedRate:1400, seekRate:1100, zOffset:4 })

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
                            />

                            <PlotterConfiguration 
                                configuration={configuration}
                                setConfiguration={setConfiguration}
                            />

                            <div className="flex justify-between items-center w-full">
                                <button className="generateGcode" id="generateGcode"><i className="fa-solid fa-gears"></i> Generate G-Code</button>  
                                <button className="plot" id="sendSerial">Send <i className="fa-solid fa-print fa-sm"></i></button>
                            </div>
                        </div>

                        <div className="w-2/5">
                            <DirectionButtons />
                        </div>
                    </div>
                </div>
                <div className='textareaGroup w-full lg:h-3/5'>
                    <GcodeSection />
                </div>
            </div>
        </>
    )
}

function SerialButtons({ port, setPort, reader, setReader, writer, setWriter }) {
    const [isToggled, setIsToggled] = useState(true)
    const [receivedText, setRecievedText] = useState(null)
    const [portOpened, setPortOpened] = useState(false)

    const connectSerial = async () => {
        try {
            const newPort = await navigator.serial.requestPort();
            await newPort.open({ baudRate : 9600 });
            console.log('Port Opened Successfully');
            setPort(newPort);
            setWriter(newPort.writable.getWriter());
            setReader(newPort.readable.getReader());
            setPortOpened(true)
        } catch (error) {
            console.error('Error While Connecting ::', error);
        }
    }


    const setOrigin = async () => {
        try {
            if (!writer) return;

            const dataToSend = isToggled ? '1' : '0';
            setIsToggled(!isToggled)
            // const dataToSend = 'G21\n'
            await writer.write(new TextEncoder().encode(dataToSend))

            const response = await reader.read();
            setRecievedText(new TextDecoder().decode(response.value))

            console.log(receivedText)

        } catch (error) {
            console.error('Error Sending Data ::', error);
        }
    }


    const closeSerial = async () => {
        if (port) {
            await reader.releaseLock();
            await writer.releaseLock();
            await port.close();
            console.log('Port Closed Successfully >>>')
            setPortOpened(false)
        }
    }

    return (
        <>
            <div className="flex gap-3 w-full items-center justify-center controlBtnGroup">
                <button 
                    onClick={connectSerial} 
                    className="connect"
                    style={{display: portOpened ? 'none' : 'block'}} >Connect <i className="fa-solid fa-plug-circle-bolt"></i></button>
                <button 
                    onClick={closeSerial} 
                    className="connect" 
                    style={{display: portOpened ? 'block' : 'none', marginLeft:'auto', transition:'0.5s ease', backgroundColor:'#9d1818'}}>Disconnect <i className="fa-solid fa-plug-circle-xmark" style={{color: "white"}}></i></button>
                <button onClick={setOrigin} className='originBtn' data-command="G10 P0 L20 X0Y0Z0">Set Origin</button>
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
                    <input onInput={handleInput} type="number" max="9999" min="0" name='feedRate' maxLength="4" placeholder="1100" />
                </div>
                <div className="flex items-center justify-between">
                    <label htmlFor="seekRate">seekRate</label>
                    <input onInput={handleInput} type="number" max="9999" min="0" name='seekRate' maxLength="4" placeholder="1400" disabled/>
                </div>
                <div className="flex items-center justify-between">
                    <label htmlFor="zOffset">zOffset</label>
                    <input onInput={handleInput} type="number" max="9" name='zOffset' maxLength="1" placeholder="4" disabled/>
                </div>
            </div>
        </>
    )
}


function GcodeSection() {
    return (
        <>
            <div className="flex gap-6 h-full">
                <div className='w-full'>
                    <div className="textArea h-full">
                        <div className="flex justify-between items-center p-6 h-[10%]">
                            <h1>G - Code</h1>
                            <button id="downloadGcode"><i className="fa-solid fa-download fa-lg" style={{color: '#3A5A99'}}></i></button>
                        </div>
                        <textarea name="gcode" className='h-[90%]' id="gcode"></textarea>
                    </div>
                </div>
                <div className='w-full'>
                    <div className="responseArea h-full">
                        <div className='flex items-center p-6 h-[10%]'>
                            <h1>Response</h1>
                        </div>
                        <textarea name="responseArea" className='h-[90%] w-full' id="responseArea" disabled></textarea>
                    </div>
                </div>
            </div>
        </>
    )
}


function DirectionButtons() {
    return (
        <>
            <div className="button-group">
                <button className="direction-button up" id="dirUp" data-command="G0 Y5">
                    <i className="fa-solid fa-circle-chevron-up"></i>
                </button>
                <button className="direction-button left" id="dirLeft" data-command="G0 X-5">
                    <i className="fa-solid fa-circle-chevron-left"></i>
                </button>
                <button className="center-button" data-command="M03 S123">
                    <i className="fa-brands fa-centercode"></i>
                </button>
                <button className="direction-button right" id="dirRight" data-command="G0 X5">
                    <i className="fa-solid fa-circle-chevron-right"></i>
                </button>
                <button className="direction-button down" id="dirDown" data-command="G0 Y-5">
                    <i className="fa-solid fa-circle-chevron-down"></i>
                </button>
            </div>
        </>
    )
    
}

export default Controls