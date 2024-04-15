let VERTEX_SHADER = `
    attribute vec4 a_Position;

    uniform float u_Size;

    void main(){
        gl_Position = a_Position;
        gl_PointSize = u_Size;
    }

`;

let FRAGMENT_SHADER = `
    precision mediump float;

    uniform vec4 u_FragColor;

    void main(){ 
        gl_FragColor = u_FragColor;
    }

`;

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

let canvas;
let gl;
let a_position;
let u_FragColor;
let u_Size;
let g_selectedType = POINT;

function setUpWebGL() {
    canvas = document.getElementById("webgl");

    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
    if (!gl) {
        console.log("Failed to get WebGL context.");
        return -1;
    }
}

function vGLSL() {

    if (!initShaders(gl, VERTEX_SHADER, FRAGMENT_SHADER)) {
        console.log("Failed to load/compile shaders");
        return -1;
    }

    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }

    u_Size = gl.getUniformLocation(gl.program, 'u_Size');
    if (!u_Size) {
        console.log('Failed to get the storage location of u_Size');
        return;
    }

}

let g_selectedColor = [0.5, 0.5, 0.5, 1.0];
let g_size = 20;
let g_seg = 10;

function HTMLactions(){

    document.getElementById('Squares').onclick = function() { g_selectedType = POINT; };
    document.getElementById('Triangles').onclick = function() { g_selectedType = TRIANGLE; };
    document.getElementById('Circles').onclick = function() { g_selectedType = CIRCLE; };

    document.getElementById('redS').addEventListener('mouseup', function(){ g_selectedColor[0] = this.value/100;})
    document.getElementById('greenS').addEventListener('mouseup', function(){ g_selectedColor[1] = this.value/100;})
    document.getElementById('blueS').addEventListener('mouseup', function(){ g_selectedColor[2] = this.value/100;})

    document.getElementById('size').addEventListener('mouseup', function(){ g_size = this.value; })
    document.getElementById('seg').addEventListener('mouseup', function(){ g_seg = this.value; })

}

function main() {

    console.log("Hai :D!!!");

    setUpWebGL();

    vGLSL();

    HTMLactions();

    canvas.onmousedown = click;
    canvas.onmousemove = function(ev) { if(ev.buttons == 1) { click(ev) } };

    clearCanvas();

}

var g_shapeList = [];

function clearCanvas() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    g_shapeList = [];
    console.log("Canvas Cleared!");
}

// The array for the position of a mouse press
function click(ev) {

    [x, y] = convertCoord(ev);

    let point;

    if (g_selectedType == POINT){
        point = new Point()
    } else if (g_selectedType == TRIANGLE){
        point = new Triangle();
    } else if (g_selectedType == CIRCLE){
        point = new Circle();
        point.segments = g_seg;
    }

    // Store the coordinates to g_points array
    point.position = [x, y];
    
    point.color = [g_selectedColor[0], g_selectedColor[1], g_selectedColor[2], g_selectedColor[3]];

    point.size = g_size;

    g_shapeList.push(point);

    renderShapes();

}

function convertCoord(ev){
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

    return [x, y];
}

function renderShapes(){
    gl.clear(gl.COLOR_BUFFER_BIT);

    var len = g_shapeList.length;
    for (var i = 0; i < len; i++) {

        g_shapeList[i].render();

    }
        
}
