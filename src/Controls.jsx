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

    const generateGcode = () => {
        const converter = new Converter(configuration);
        if (svgContent) {
            converter.convert(svgContent).then(gcode => {
                const lines = gcode[0].split('\n');
                const cleanedLines = lines.map(line => {
                    const trimmedLine = line.trim();
                    if (trimmedLine.includes('G0 Z4')) {
                        return 'M03S000';
                    } else if (trimmedLine.includes('G0 Z0')) {
                        return 'M03S123';
                    }
                    return trimmedLine;
                });
                setGcode(cleanedLines.join('\n'));
            });
        }
    }


    const plotGcode = async () => {
        let GcodeArray = [];
        const gcodeLines = gcode.split('\n');

        gcodeLines.forEach((line) => {
            const trimmedLine = line.trim();

            if (trimmedLine !== "") {
                GcodeArray.push(trimmedLine)
            }
        })

        for (const command of GcodeArray) {
            console.log('Command ::', command);

            await writer.write(new TextEncoder().encode(`${command}\n`))
            logSerialData(reader, setResponse)
        }        
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
                                <button className="generateGcode" onClick={generateGcode}>
                                    <i className="fa-solid fa-gears"></i> Generate G-Code
                                </button>  
                                <button className="plot" onClick={plotGcode}>
                                    Send <i className="fa-solid fa-print fa-sm"></i>
                                </button>
                            </div>
                        </div>

                        <div className="w-2/5">
                            <DirectionButtons
                                writer={writer}
                                reader={reader}
                                setResponse={setResponse}  
                            />
                        </div>
                    </div>
                </div>
                <div className='textareaGroup w-full lg:h-3/5'>
                    <GcodeSection 
                        response={response}
                        setResponse={setResponse}
                        gcodeData={gcode}
                        setGcode={setGcode}
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
        let responseData = new TextDecoder().decode(readerResult.value);

        // Update response with the new data
        setResponse(prevData => prevData + responseData);

        // Check if reading process is done
        if (readerResult.done) {
            console.log('Reading process is completed.');
        } else {
            // Continue reading data recursively
            logSerialData(reader, setResponse);
        }

    } catch (error) {
        console.error('Error Fetching Data:', error);
    }
}


function GcodeSection(props) {

    const downloadGcode = () => {
        if (props.gcode) {
            // Create a Blob with the G-code data
            const gcodeFile = new Blob([props.gcodeData], { type : 'text/plain' })

            // Create a link element to trigger the download
            const link = document.createElement('a');
            link.href = URL.createObjectURL(gcodeFile);
            link.download = 'G-Code-OutPut.gcode';
            link.click();

            // Revoke the object URL to release resources
            URL.revokeObjectURL(link.href)
        } else {
            console.error('Please Choose An SVG')
        }
    }

    return (
        <>
            <div className="flex gap-6 h-full">
                <div className='w-full'>
                    <div className="textArea h-full">
                        <div className="flex justify-between items-center p-6 h-[10%]">
                            <h1>G - Code</h1>
                            <button onClick={downloadGcode}>
                                <i className="fa-solid fa-download fa-lg" style={{color: '#3A5A99'}}></i>
                            </button>
                        </div>
                        {/* Text area to display and edit G-code */}
                        <textarea 
                            name="gcode" 
                            className='h-[90%]' 
                            id="gcode" 
                            value={props.gcodeData} 
                            onChange={(e) => props.setGcode(e.target.value)} >
                        </textarea>
                    </div>
                </div>
                <div className='w-full'>
                    <div className="responseArea h-full">
                        <div className='flex items-center p-6 h-[10%]'>
                            <h1>Response</h1>
                        </div>
                        {/* Text area to display response */}
                        <textarea 
                            name="responseArea" 
                            className='h-[90%] w-full' 
                            id="responseArea" 
                            value={props.response}
                            disabled>   
                        </textarea>
                    </div>
                </div>
            </div>
        </>
    )
}


export { logSerialData }
export default Controls