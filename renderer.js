
//----------------------------------------------------------------------
// --project: 2d game in JavaScript with WebGL
// --file: renderer.js
// --autor:   Rafał Romanowski
// --Bialystok University of Technology 2014
//----------------------------------------------------------------------

var gl;
var shaderProgram;
var vbo;
var matrix = mat4.create();

var VERTEX_SHADER_SOURCE = 
"\
attribute vec3 aPos;\
uniform mat4 uMVP;\
void main() \
{ \
	gl_Position = uMVP * vec4(aPos, 1.0); \
}\
";

var FRAGMENT_SHADER_SOURCE =
"\
precision mediump float;\
void main()\
{\
	gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);\
}\
";

function main () 
{
	var canvas = document.getElementById("webgl");
	try
	{
		gl = canvas.getContext("experimental-webgl");
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
	}
	catch(e) {}

	if(!gl)
		alert("cant gl");

	initShaders();
	initBuffers();

	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clearColor(Math.random(), Math.random(), Math.random(), 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, matrix);
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vbo.itemSize, gl.FLOAT, false, 0, 0);
	gl.uniformMatrix4fv(shaderProgram.mvpMatrixUniform, false, matrix);
	gl.drawArrays(gl.TRIANGLES, 0, vbo.numItems);
}

function initShaders()
{
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertexShader, VERTEX_SHADER_SOURCE);
	gl.compileShader(vertexShader);

	if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))
		console.log("VERTEX SHADER ERROR:\n" + gl.getShaderInfoLog(vertexShader));
	else
		console.log("Vertex shader compiled successfully");
	
	gl.shaderSource(fragmentShader, FRAGMENT_SHADER_SOURCE);
	gl.compileShader(fragmentShader);

	if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS))
		console.log("FRAGMENT SHADER ERROR:\n" + gl.getShaderInfoLog(fragmentShader));
	else
		console.log("Fragment shader compiled successfully");
	
	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
		console.log("PROGRAM ERROR:\n" + gl.getProgramInfoLog(shaderProgram));
	else
		console.log("Program linked successfully");

	gl.useProgram(shaderProgram);
	shaderProgram.vetexPositionAttribute = gl.getAttribLocation(shaderProgram, "aPos");
	gl.enableVertexAttribArray(shaderProgram.vetexPositionAttribute);

	shaderProgram.mvpMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVP");
}

function initBuffers()
{
	vbo = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

    var vertices = [
         0.0,  1.0,  0.0,
        -1.0, -1.0,  0.0,
         1.0, -1.0,  0.0
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	vbo.itemSize = 3;
	vbo.numItems = 3;    
}