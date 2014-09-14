/**
 * @author namhoon <emerald105@hanmail.net>
 */

NP = {};
NP.DEBUG = true;















// ONLY FOR DEBUGGING TOOLS
if (NP.DEBUG) {
  NP.DEBUG_KEY = 'debug_key';
  NP.DEBUG_VALUE = 'debug_value';

  var _debug_container = document.createElement('div');
  _debug_container.id = 'debug';
  _debug_container.style.cssText = 'width:0px;height:0px;opacity:0.9;';

  var _debug_addKey = function (key, value) {
    var el = document.createElement('span');
    el.id = 'debug_key';
    el.style.cssText = 'width:200px;height:100px;background-color:#fff;color:#000;font-size:14px;font-family:Helvetica,Arial,sans-serif;line-height:20px;top:50px;left:0px;position:absolute;padding-left:10px;';
    el.textContent = key;
    _debug_container.appendChild(el);

    var el2 = document.createElement('span');
    el2.id = 'debug_key';
    el2.style.cssText = 'width:200px;height:100px;background-color:#fff;color:#000;font-size:14px;font-family:Helvetica,Arial,sans-serif;line-height:20px;top:70px;left:0px;position:absolute;padding-left:10px;';
    el2.textContent = value;
    _debug_container.appendChild(el2);
  };

  window.onload = function() {
    document.body.appendChild(_debug_container);
  }
}
/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * Utility class
 *
 * @class NP.Util
 * @constructor
 */
NP.Util = function() {
  /**
   *  return if it is integer
   *
   *  @method isInt
   *  @param n
   *  @return {boolean}
   */
  this.isInt = function(n) {
    return typeof n === 'number' && n % 1 === 0;
  };

//  /**
//   *  Convert int to float number
//   *
//   *  @method intToFloat
//   *  @param n {number}
//   *  @return {number} float number
//   */
//  this.intToFloat = function(n) {
//    var f:float = n;
//    return f;
//  }
};

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

  var defaults = {
  };

  var engine = new NP.Engine(this);
  var renderer = new NP.Renderer(canvasContainer);

  var deltaT = 0.01;
  this.gravity = new THREE.Vector3(0, 9.8, 0);

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
   * Control camera
   ****************************************************/
  var camera = renderer.camera;
  var cameraLookPosition = renderer.scene.position;
  var radius = 30;
  var theta = 30;
  var phi = 50;

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

  var geometry = new THREE.SphereGeometry(0.5);
  var material = new THREE.MeshBasicMaterial();
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
//          cameraVertVel = 0;
          break;
        case 83:
        case 40:
          pressedKeys[KEY_DOWN] = false;
//          cameraVertVel = 0;
          break;
        case 65:
        case 37:
          pressedKeys[KEY_LEFT] = false;
//          cameraHoriVel = 0;
          break;
        case 68:
        case 39:
          pressedKeys[KEY_RIGHT] = false;
//          cameraHoriVel = 0;
          break;
      }
    }, false);
  })();
};

NextPhysics.prototype.constructor = NextPhysics;

/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NP.Engine
 * @constructor
 */
NP.Engine = function(physics) {
  var objects = [];
  var pairs = [];

  this.add = function(npobject) {
    objects.push(npobject)
  };

  this.update = function(deltaT) {

  };





//    resetForce(objects);
//    solveExternalForce(objects);
//
//    resetPairs(pairs);
//    pairs = detectCollision(objects);
//    solveInternalForce(pairs);
//
//    function resetForce(objects) {
//      _.each(objects, function(object) {
//        object.resetForce();
//      });
//    }
//
//    function solveExternalForce(objects) {
//      _.each(objects, function(object) {
//        if (object.enableGravity) object.force.add(physics.gravity);
//      });
//    }
//
//    function resetPairs(pairs) {
//      pairs = [];
//    }
//
//    function detectCollision(objects) {
//      var i, j, length;
//      var pair;
//      for (i=0, length=objects.length; i<length; i++) {
//        var objA = objects[i];
//        for (j=i; j<length; j++) {
//          var objB = objects[j];
//          var distance = objA.distanceTo(objB);
//          if (objA.radius+objB.radius > distance) {
//            pair = new NP.Pairs(objA, objB);
//            pair.distance = distance;
//            pairs.append(pair);
//          }
//        }
//      }
//    }
//
//    function solveInternalForce(pairs) {
//      _.each(pairs, function(pair) {
//        var objA = pair[0];
//        var objB = pair[1];
//        objA.
//      });
//    }
//  };
};

NP.Engine.prototype.constructor = NP.Engine;



NP.Pairs = function(objectA, objectB) {
  this.objectA = objectA;
  this.objectB = objectB;
};
/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NP.Force
 * @constructor
 */
NP.Force = function(x, y, z) {
  this.x = x !== undefined ? x : 0;
  this.y = y !== undefined ? y : 0;
  this.z = z !== undefined ? z : 0;
};

NP.Force.prototype.constructor = NP.Force;

/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * Everything can be on canvas is inherited NP.Object
 *
 * @class NP.Object
 * @constructor
 */
NP.Object = function() {
  this.type = undefined;
  this.forceFlag = true;
  this.forces = [];
  this.force = new THREE.Vector3();
  this.velocity = new THREE.Vector3();
  this.position = new THREE.Vector3();

  this.k = 20000; // N/m

  this.enableGravity = true;
};

NP.Object.prototype.constructor = NP.Object;

NP.Object.Type = {
  LINE: 'line',
  CIRCLE: 'circle',
  SPHERE: 'sphere'
};

NP.Object.prototype.resetForce = function() {
  this.forces = [];
};

NP.Object.prototype.addForce = function(force) {
  if (!force instanceof NP.Force) return;
  this.forces.append(force);
};

NP.Object.prototype.update = function(deltaT) {
  this.velocity.x += this.force.x * deltaT;
  this.velocity.y += this.force.y * deltaT;
  this.velocity.z += this.force.z * deltaT;

  this.position.x += this.velocity.x * deltaT;
  this.position.y += this.velocity.y * deltaT;
  this.position.z += this.velocity.z * deltaT;
};

NP.Object.prototype.renderScript = function(renderOptions) {
};

NP.Object.prototype.renderScript = function(renderOptions) {

};

NP.Object.prototype.onCollision = function(v) {
};

NP.Object.prototype.onMouseOver = function(e) {

};
/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * NP.ObjectContainer can contains every NP.Object
 *
 * @class NP.ObjectContainer
 * @constructor
 */
NP.ObjectContainer = function() {
  NP.Object.call(this);

  /**
   * The list of contained object.
   *
   * @type {Array}
   */
  this.childs = [];
};

NP.ObjectContainer.prototype = Object.create(NP.Object.prototype);
NP.ObjectContainer.prototype.constructor = NP.ObjectContainer;

/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NP.Sphere
 * @constructor
 */
NP.Sphere = function(x, y, z, radius) {
  NP.Object.call(this);
  this.type = NP.Object.Type.SPHERE;

  this.position = new THREE.Vector3();
  this.position.x = x !== undefined ? x : 0;
  this.position.y = y !== undefined ? y : 0;
  this.position.z = z !== undefined ? z : 0;
  this.radius = radius !== undefined ? radius : 1;

  this.k = 20000;   // 20000 N/m
};

NP.Sphere.prototype = Object.create(NP.Object.prototype);
NP.Sphere.prototype.constructor = NP.Sphere;

NP.Sphere.prototype.renderScript = function(scene, renderOptions) {
  var segments = renderOptions['segments'] !== undefined ? renderOptions['segments'] : 32;

  var geometry = new THREE.SphereGeometry(this.radius, segments, segments);
  var material = new THREE.MeshBasicMaterial({
    color: renderOptions['color1'] !== undefined ? renderOptions['color1'] : NP.ColorSets[0]['color1'],
    wireframe: true
  });
  var sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(this.position.x, this.position.y, this.position.z);
  this.position = sphere.position;
  scene.add(sphere);
};
//
//NP.Sphere.prototype.onCollision = function(v) {
//  var dist = this.position.distanceTo(v);
//  var fx = this.k * (this.radius - dist) * (this.position.x-v.x) / dist;
//  var fy = this.k * (this.radius - dist) * (this.position.y-v.y) / dist;
//  var fz = this.k * (this.radius - dist) * (this.position.z-v.z) / dist;
//  var f = new NP.Force();
//  f.position = this.position;
//  f.vector.x = fx;
//  f.vector.y = fy;
//  f.vector.z = fz;
//  this.addForce(f);
//};

/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * Objects color set for renderer.
 *
 * @class NP.ColorSets
 * @constructor
 */
NP.ColorSets = (function() {
  /**
   * Samples of color sets from Adobe Kuler.
   *
   * Color set sample object:
   *
   * {
   *   background: '#FFFFFF',
   *   color1: '#FFFFFF',
   *   color2: '#FFFFFF',
   *   color3: '#FFFFFF',
   *   color4: '#FFFFFF'
   * }
   *
   */

  /**
   * 'Flat Design Colors v2'
   * https://kuler.adobe.com/Copy-of-Flat-Design-Colors-v2-color-theme-3936285/
   */
  var Flat_Design_Colors_v2 = {
    background: 0xFFFFFF,
    color1: 0xDF4949,
    color2: 0xE27A3F,
    color3: 0xEFC94C,
    color4: 0x45B29D,
    color5: 0x334D5C
  };

  /**
   * return color sets
   */
  return [
    Flat_Design_Colors_v2
  ];
})();
/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * Next physics renderer
 *
 * @class NP.Renderer
 * @constructor
 * @param canvasContainer {HTMLDivElement}
 */
NP.Renderer = function(canvasContainer) {
  var renderer = new THREE.WebGLRenderer();
  var scene = new THREE.Scene();
  this.scene = scene;
  var camera = new THREE.PerspectiveCamera(45, canvasContainer.offsetWidth / canvasContainer.offsetHeight, 0.0001, 100000);
  var colorSet = NP.ColorSets[0];
  var updateFunctions = [];

  renderer.setClearColor(new THREE.Color(0xEEEEEE));
  renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
  canvasContainer.appendChild(renderer.domElement);
  scene.add(camera);

  // Grid
  var material = new THREE.LineBasicMaterial( { color: 0xa0a0a0} );
  var geometry = new THREE.Geometry();
  var floor = -0.04, step = 1, size = 14;

  for ( var i = 0; i <= size / step * 2; i ++ ) {
    geometry.vertices.push( new THREE.Vector3( - size, floor, i * step - size ) );
    geometry.vertices.push( new THREE.Vector3(   size, floor, i * step - size ) );
    geometry.vertices.push( new THREE.Vector3( i * step - size, floor, -size ) );
    geometry.vertices.push( new THREE.Vector3( i * step - size, floor,  size ) );
  }
  var line = new THREE.Line( geometry, material, THREE.LinePieces );
  scene.add( line );


  var axes = new THREE.AxisHelper( 100 );
  scene.add(axes);

  this.camera = camera;
  this.canvas = renderer.domElement;

  this.render = function() {
    var i, len;
    for (i=0, len=updateFunctions.length; i<len; i++) {
      updateFunctions[i].call(this);
    }
    renderer.render(scene, camera);
  };

  this.add = function(object) {
    var renderOptions = {
      segments: 16,
      color1: colorSet['color1']
    };

    object.renderScript(scene, renderOptions, updateFunctions);
  };
};

NP.Renderer.prototype.constructor = NP.Renderer;
