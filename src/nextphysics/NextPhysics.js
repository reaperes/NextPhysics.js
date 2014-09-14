/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NextPhysics
 * @param canvasContainer {HTMLElement}
 * @constructor
 */
NextPhysics = function (canvasContainer) {
  // prevent right mouse click
  document.oncontextmenu = document.body.oncontextmenu = function() {return false;};

  var engine = new NP.Engine(this);
  var renderer = new NP.Renderer(canvasContainer);

  var deltaT = 0.01;

  this.add = function (npobject) {
    engine.add(npobject);
    renderer.add(npobject);
  };

  this.border = function (x1, y1, z1, x2, y2, z2) {
  };

  /****************************************************
   * Physics loop
   ****************************************************/

  this.update = function () {
    handleKey();
    engine.update(deltaT);
  };

  this.render = function () {
    renderer.render();
  };

  this.start = function() {
    var loop = function() {
      this.update();
      this.render();
      requestAnimationFrame(loop, renderer.canvas);
    }.bind(this);

    var debugLoop = function() {
      stats.begin();
      this.update();
      this.render();
      stats.end();
      requestAnimationFrame(debugLoop, renderer.canvas);
    }.bind(this);

    if (NP.DEBUG) {
      var stats = new Stats();
      stats.setMode(0); // 0: fps, 1: ms
      stats.domElement.style.position = 'absolute';
      stats.domElement.style.left = '0px';
      stats.domElement.style.top = '0px';
      document.body.appendChild( stats.domElement );
      requestAnimationFrame(debugLoop, renderer.canvas);
    }
    else {
      requestAnimationFrame(loop, renderer.canvas);
    }
  };

  /****************************************************
   * Physics code
   ****************************************************/
  this.apply = function (parameters) {
    if (parameters === undefined) return;

    var keys = Object.keys(parameters);
    var i, l;
    for (i=0, l=keys.length; i<l; i++) {
      var key = keys[i];
      var value = parameters[key];
      if (key == 'force') {
        if (!(value instanceof NP.Force)) throw new Error('NextPhysics#apply: force value must be NP.Force object');
        var j, m, objects = engine.objects;
        for (j=0, m=objects.length; j<m; j++) {
          objects[j].applyForce(value);
        }
      }
    }
  };

  this.remove = function (parameters) {
    if (parameters === undefined) return;

    var keys = Object.keys(parameters);
    var i, l;
    for (i=0, l=keys.length; i<l; i++) {
      var key = keys[i];
      var value = parameters[key];
      if (key == 'force') {
        if (typeof value != 'string') throw new Error('NextPhysics#remove: force value must be force name (string)');
        var j, m, objects = engine.objects;
        for (j=0, m=objects.length; j<m; j++) {
          objects[j].removeForce(value);
        }
      }
    }
  };

  /****************************************************
   * Control camera
   ****************************************************/
  var camera = renderer.camera;
  var cameraLookPosition = renderer.scene.position;
  var radius = 20;
  var theta = 0;
  var phi = 10;

  //          w 87 119
  // a 65 97  s 83 115  d 68 100
  var KEY_UP = 0;
  var KEY_DOWN = 2;
  var KEY_LEFT = 1;
  var KEY_RIGHT = 5;
  var pressedKeys = {
    0: false,
    2: false,
    1: false,
    5: false
  };

  // camera focus
  var geometry = new THREE.SphereGeometry(0.5);
  var material = new THREE.MeshBasicMaterial({transparent:true,opacity:0.5,color:0xffffff});
  var sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(cameraLookPosition.x, cameraLookPosition.y, cameraLookPosition.z);
  renderer.scene.add(sphere);

  var cameraVel = .5;
  function handleKey() {
    if (pressedKeys[KEY_UP] != pressedKeys[KEY_DOWN]) {
      var dy = cameraVel;

      if (pressedKeys[KEY_UP]) {
        camera.position.y += dy;
        cameraLookPosition.y += dy;
      }
      else {
        camera.position.y -= dy;
        cameraLookPosition.y -= dy;
      }
      sphere.position.set(cameraLookPosition.x, cameraLookPosition.y, cameraLookPosition.z);
    }
    if (pressedKeys[KEY_LEFT] != pressedKeys[KEY_RIGHT]) {
      var dx = -cameraVel * Math.cos(theta * Math.PI / 360);
      var dz = cameraVel * Math.sin(theta * Math.PI / 360);

      if (pressedKeys[KEY_LEFT]) {
        camera.position.x += dx;
        cameraLookPosition.x += dx;
        camera.position.z += dz;
        cameraLookPosition.z += dz;
      }
      else {
        camera.position.x -= dx;
        cameraLookPosition.x -= dx;
        camera.position.z -= dz;
        cameraLookPosition.z -= dz;
      }
      sphere.position.set(cameraLookPosition.x, cameraLookPosition.y, cameraLookPosition.z);
    }
  }

  (function() {
    camera.position.x = radius * Math.sin(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360);
    camera.position.y = radius * Math.sin(phi * Math.PI / 360);
    camera.position.z = radius * Math.cos(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360);
    camera.lookAt(cameraLookPosition);

    var isMouseDown, onMouseDownTheta, onMouseDownPhi;
    var onMouseDownPosition = new THREE.Vector2();
    canvasContainer.addEventListener('mousedown', function (event) {
      event.preventDefault();
      isMouseDown = true;
      onMouseDownTheta = theta;
      onMouseDownPhi = phi;
      onMouseDownPosition.x = event.pageX;
      onMouseDownPosition.y = event.pageY;
    }, false);

    canvasContainer.addEventListener('mousemove', function (event) {
      event.preventDefault();
      if (!isMouseDown) return;

      theta = -(event.pageX - onMouseDownPosition.x) * 1.5 + onMouseDownTheta;
      phi = (event.clientY - onMouseDownPosition.y) * 1.5 + onMouseDownPhi;
      camera.position.x = cameraLookPosition.x + radius * Math.sin(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360);
      camera.position.y = cameraLookPosition.y +radius * Math.sin(phi * Math.PI / 360);
      camera.position.z = cameraLookPosition.z +radius * Math.cos(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360);
      //    camera.updateProjectionMatrix();
      camera.lookAt(cameraLookPosition);
    }, false);

    canvasContainer.addEventListener('mouseup', function (event) {
      event.preventDefault();
      isMouseDown = false;
      onMouseDownPosition.x = event.pageX - onMouseDownPosition.x;
      onMouseDownPosition.y = event.pageY - onMouseDownPosition.y;
    }, false);

    canvasContainer.addEventListener('mouseover', function (e) {
    }.bind(this), false);
    canvasContainer.addEventListener('mousewheel', function (event) {
      event.preventDefault();

      var wheelDistance = camera.position.distanceTo(cameraLookPosition) * 0.1;
      if (event.wheelDelta > 0) {
        camera.position.x -= wheelDistance * Math.sin(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360);
        camera.position.y -= wheelDistance * Math.sin(phi * Math.PI / 360);
        camera.position.z -= wheelDistance * Math.cos(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360);
        radius -= wheelDistance;
      }
      else {
        camera.position.x += wheelDistance * Math.sin(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360);
        camera.position.y += wheelDistance * Math.sin(phi * Math.PI / 360);
        camera.position.z += wheelDistance * Math.cos(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360);
        radius += wheelDistance;
      }
    }, false);

    /****************************************************
     * Keyboard handling
     ****************************************************/
    window.addEventListener('keydown', function (e) {
      switch (e.keyCode) {
        case 87:
        case 38:
          pressedKeys[KEY_UP] = true;
          break;
        case 83:
        case 40:
          pressedKeys[KEY_DOWN] = true;
          break;
        case 65:
        case 37:
          pressedKeys[KEY_LEFT] = true;
          break;
        case 68:
        case 39:
          pressedKeys[KEY_RIGHT] = true;
          break;
      }
    }, false);

    window.addEventListener('keyup', function (e) {
      switch (e.keyCode) {
        case 87:
        case 38:
          pressedKeys[KEY_UP] = false;
          break;
        case 83:
        case 40:
          pressedKeys[KEY_DOWN] = false;
          break;
        case 65:
        case 37:
          pressedKeys[KEY_LEFT] = false;
          break;
        case 68:
        case 39:
          pressedKeys[KEY_RIGHT] = false;
          break;
      }
    }, false);
  })();
};

NextPhysics.prototype.constructor = NextPhysics;
