import './App.css'

function Display() {
    return (
        <>
        <div id='dropArea' className="w-3/4 h-full p-5 svgDiv">
            <div id="drop">
            <p class="mb-3">Drag The File Here</p>
            <input type="file" name="svg" id="svgInput" placeholder="Choose The SVG File" />
            </div>
            <div id="result">
                <div id="zoomContainer">
                </div>
            </div>
        </div>
        </>
    )
}

export default Display