import React from "react";
import { useState } from "react";
import { logSerialData } from './Controls'

function SerialButtons({ port, setPort, reader, setReader, writer, setWriter, setResponse }) {
    const [isToggled, setIsToggled] = useState(false)
    const [portOpened, setPortOpened] = useState(false)

    const connectSerial = async () => {
        try {
            const newPort = await navigator.serial.requestPort();
            await newPort.open({ baudRate : 115200 });
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

            // const dataToSend = isToggled ? '0' : '1';
            // setIsToggled(!isToggled)
            const dataToSend = 'G28\n'
            await writer.write(new TextEncoder().encode(dataToSend))
            logSerialData(reader, setResponse)

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


function DirectionButtons({writer, reader, setResponse}) {
    const handleCommand = async (event) => {
        const command = event.currentTarget.dataset.command;
        let currentTarget = event.currentTarget;
        if (!writer) return
        await writer.write(new TextEncoder().encode(`${command}\n`))

        if (currentTarget) {
            if (command === 'M03S123') {
                currentTarget.setAttribute('data-command', 'M03S000')
            } else if (command === 'M03S000') {
                currentTarget.setAttribute('data-command', 'M03S123')
            }
        }
        // const respons = await reader.read()
        logSerialData(reader, setResponse)
    }
    return (
        <>
            <div className="button-group">
                <button onClick={handleCommand} className="direction-button up" id="dirUp" data-command="G01X0Y5">
                    <i className="fa-solid fa-circle-chevron-up"></i>
                </button>
                <button onClick={handleCommand} className="direction-button left" id="dirLeft" data-command="G01X-5">
                    <i className="fa-solid fa-circle-chevron-left"></i>
                </button>
                <button onClick={handleCommand} className="center-button" data-command="M03S123">
                    <i className="fa-brands fa-centercode"></i>
                </button>
                <button onClick={handleCommand} className="direction-button right" id="dirRight" data-command="G01X5">
                    <i className="fa-solid fa-circle-chevron-right"></i>
                </button>
                <button onClick={handleCommand} className="direction-button down" id="dirDown" data-command="G01X0Y-5">
                    <i className="fa-solid fa-circle-chevron-down"></i>
                </button>
            </div>
        </>
    )
    
}

export { SerialButtons, DirectionButtons }