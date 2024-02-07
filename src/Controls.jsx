import './Controls.css'

function Controls() {
    const handleInputChange = (event) => {
        if (event.target.value > event.target.maxLength) {
            event.target.value = event.target.value.slice(0, event.target.maxLength);
        }
    };
    return (
        <>
            <div className="flex flex-wrap md:items-center lg:items-start md:w-full sm:w-full lg:w-2/5 h-full">
                <div className="w-full p-3">
                    <div className="flex items-center lg:h-1/3 max-[646px]:h-full max-[646px]:flex-col">
                        <div className="flex gap-5 p-3 flex-wrap w-3/5 max-[646px]:w-full">
                            <div className="flex gap-3 w-full items-center justify-center controlBtnGroup">
                                <button className="connect" id="connect">Connect <i className="fa-solid fa-plug-circle-bolt"></i></button>
                                <button id="disconnect" className="connect" style={{display:'none', marginLeft:'auto', transition:'0.5s ease', backgroundColor:'#9d1818'}}>Disconnect <i className="fa-solid fa-plug-circle-xmark" style={{color: "white"}}></i></button>
                                <button className='originBtn' data-command="G10 P0 L20 X0Y0Z0">Set Origin</button>
                            </div>

                            <div className="flex controlInputGroup">
                                <div className="flex items-center justify-between">
                                    <label htmlFor="feedRate">feedRate</label>
                                    <input id="feedRate" type="number" max="9999" maxLength="4" placeholder="1100" disabled onInput={handleInputChange}/>
                                </div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="feedRate">seekRate</label>
                                    <input id="seekRate" type="number" max="9999" maxLength="4" placeholder="1400" disabled onInput={handleInputChange}/>
                                </div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="feedRate">zOffset</label>
                                    <input id="zOffset" type="number" max="9999" maxLength="4" placeholder="4" disabled onInput={handleInputChange}/>
                                </div>
                            </div>

                            <div className="flex justify-between items-center w-full">
                                <button className="generateGcode" id="generateGcode"><i className="fa-solid fa-gears"></i> Generate G-Code</button>  
                                <button className="plot" id="sendSerial">Send <i className="fa-solid fa-print fa-sm"></i></button>
                            </div>
                        </div>

                        <div className="w-2/5">
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


function GcodeSection() {
    return (
        <>
            <div className="flex gap-6 h-full">
                <div className='w-full'>
                    <div className="textArea h-full">
                        <div className="flex justify-between items-center p-6 h-[10%]">
                            <h1>G - Code</h1>
                            <button id="downloadGcode"><i class="fa-solid fa-download fa-lg" style={{color: '#3A5A99'}}></i></button>
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

export default Controls