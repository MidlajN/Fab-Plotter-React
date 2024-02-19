import React from "react";
import { useState } from "react";
import { logSerialData } from './Controls'


function SerialButtons({ port, setPort, reader, setReader, writer, setWriter, setResponse }) {
    const [isToggled, setIsToggled] = useState(false)
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

            const dataToSend = isToggled ? '0' : '1';
            setIsToggled(!isToggled)
            // const dataToSend = 'G21\n'
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

export { SerialButtons, DirectionButtons }