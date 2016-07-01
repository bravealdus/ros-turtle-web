var app = angular.module('rossturtleApp', []);

app.controller('WebGLController', function PhoneListController($scope) {
  // Get A WebGL context
  var canvas = document.getElementById("canvas");
  // setupLesson(canvas);
  var gl = canvas.getContext("webgl");


  // setup GLSL program
  var program = createProgramFromScripts(gl, ["2d-vertex-shader", "2d-fragment-shader"]);
  gl.useProgram(program);

  // look up where the vertex data needs to go.
  var positionLocation = gl.getAttribLocation(program, "a_position");

  // lookup uniforms
  var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  var colorLocation = gl.getUniformLocation(program, "u_color");

  // set the resolution
  gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

  // Create a buffer.
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  // Set a random color.
  gl.uniform4f(colorLocation, Math.random(), Math.random(), Math.random(), 1);

  var translation = [0, 0];
  var width = 30;
  var height = 30;

  drawScene();

  function updatePosition(index, val) {
    translation[index] = val;
    drawScene();
  }

  // Draw a the scene.
  function drawScene() {
    // Clear the canvas.
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Setup a rectangle
    setRectangle(gl, translation[0], translation[1], width, height);

    // Draw the rectangle.
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

});
