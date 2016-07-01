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

  var ros = new ROSLIB.Ros({
      url: 'ws://vbox.local:9090'
  });

  ros.on('connection', function() {
      console.log('Connected to websocket server.');
  });

  ros.on('error', function(error) {
      console.log('Error connecting to websocket server: ', error);
  });

  ros.on('close', function() {
      console.log('Connection to websocket server closed.');
  });

  var clearSrv = new ROSLIB.Service({
      ros: ros,
      name: '/clear',
      serviceType: 'std_srvs/Empty'
  });

  var request = new ROSLIB.ServiceRequest({});

  clearSrv.callService(request, function(result) {
      console.log('Result for service call');
      console.log(result);
  });


  var rectangleAction = new ROSLIB.ActionClient({
      ros: ros,
      serverName: '/turtle_shape',
      actionName: 'actionlib/ShapeAction'
  });

  var goal = new ROSLIB.Goal({
      actionClient: rectangleAction,
      goalMessage: {
          edges: 4,
          radius: 1
      }
  });

  var poseListener = new ROSLIB.Topic({
      ros: ros,
      name: '/turtle1/pose',
      messageType: 'turtlesim/Pose'
  });

  poseListener.subscribe(function(res) {
      updatePosition(0, res.x * 50);
      updatePosition(1, res.y * 50);
  })

  $scope.moveIt = function() {
      goal.send();
  }

// Fill the buffer with the values that define a rectangle.
function setRectangle(gl, x, y, width, height) {
  var x1 = x;
  var x2 = x + width;
  var y1 = y;
  var y2 = y + height;
  gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
          x1, y1,
          x2, y1,
          x1, y2,
          x1, y2,
          x2, y1,
          x2, y2]),
      gl.STATIC_DRAW);
}


});
