
function SvgContainer() {
    return (
        <>
        <div id='dropArea' className="lg:w-3/5 md:w-full sm:w-full h-full p-5 svgDiv" >
            <div id="drop">
            <p className="mb-3">Drag The File Here</p>
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
export default SvgContainer