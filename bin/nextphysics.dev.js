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

/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NP.Attraction
 * @constructor
 */
NP.Attraction = function(objectA, objectB, parameters) {
  this.name = '';

  this.gravitationalConstant = 0.00000000006673;
  this.objectA = objectA;
  this.objectB = objectB;

  this.setValues(parameters);
};

NP.Attraction.prototype = {
  constructor: NP.Attraction,

  setValues: function (values) {
    if (values === undefined) return;

    var keys = Object.keys(values);
    for(var i = 0, l = keys.length; i < l; i++) {
      var key = keys[i];
      var newValue = values[key];

      if (newValue === undefined) {
        console.warn( "NP.Attraction#setValues: '" + key + "' parameter is undefined." );
        continue;
      }

      if (key in this)
        this[key] = newValue;
    }
  },

  getForce: function() {
    return this.gravitationalConstant * this.objectA.mass * this.objectB.mass / this.objectA.position.distanceToSquared(this.objectB.position);
  }
};

/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NP.Engine
 * @constructor
 */
NP.Engine = function(physics) {
  var objects = [];
  this.objects = objects;

  this.add = function(object) {
    objects.push(object);
  };

  this.update = function(deltaT) {
    var i, len;
    for (i=0, len=objects.length; i<len; i++) {
      var object = objects[i];
      resetForce(object);
      updateForce(object);
      updateVelocity(object, deltaT);
      updatePosition(object, deltaT);
      checkEdges(object);
    }
  };

  function resetForce(object) {
    object.force.set(0, 0, 0);
  }

  function updateForce(object) {
    var i, l;
    var forces = object.forces;
    var force = object.force;
    for (i=0, l=forces.length; i<l; i++) {
      // update singular force
      if (forces[i].regardlessOfMass)
        force.add(forces[i]);
      else {
        if (object.mass != 0) {
          force.x += forces[i].x / object.mass;
          force.y += forces[i].y / object.mass;
          force.z += forces[i].z / object.mass;
        }
      }
    }
debugger;
    // update attraction force
    var attractions = object.attractions;
    for (i=0, l=attractions.length; i<l; i++) {
      var attraction = attractions[i];
      if (attraction.objectA.id != object.id)
        continue;

      var af = attraction.getForce();
      force.x += af.x / object.mass;
      force.y += af.y / object.mass;
      force.z += af.z / object.mass;
    }
  }

  function updateVelocity(object, deltaT) {
    object.velocity.x += object.force.x * deltaT;
    object.velocity.y += object.force.y * deltaT;
    object.velocity.z += object.force.z * deltaT;
  }

  function updatePosition(object, deltaT) {
    object.position.x += object.velocity.x * deltaT;
    object.position.y += object.velocity.y * deltaT;
    object.position.z += object.velocity.z * deltaT;
  }

  function checkEdges(object) {
    if (object.position.y < 0) {
      object.velocity.y = Math.abs(object.velocity.y);
      object.position.y = 0;
    }
  }
};

NP.Engine.prototype.constructor = NP.Engine;
/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NP.Force
 * @constructor
 */
NP.Force = function(x, y, z, parameters) {
  THREE.Vector3.call( this );

  this.name = '';

  this.x = x !== undefined ? x : 0;
  this.y = y !== undefined ? y : 0;
  this.z = z !== undefined ? z : 0;

  this.regardlessOfMass = false;

  this.setValues(parameters);
};

NP.Force.prototype = Object.create(THREE.Vector3.prototype);
NP.Force.prototype.constructor = NP.Force;

NP.Force.prototype.setValues = function (values) {
  if (values === undefined) return;

  var keys = Object.keys(values);
  for(var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    var newValue = values[key];

    if (newValue === undefined) {
      console.warn( "NP.Object#setValues: '" + key + "' parameter is undefined." );
      continue;
    }

    if (key in this) {
      var currentValue = this[key];

      if (currentValue instanceof THREE.Vector3 && newValue instanceof THREE.Vector3)
        currentValue.copy( newValue );
      else
        this[ key ] = newValue;
    }
  }
};
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
  this.id = ++NP.ObjectIdCount;
  this.name = '';

  this.forces = [];
  this.force = new THREE.Vector3();
  this.velocity = new THREE.Vector3();
  this.position = new THREE.Vector3();

  this.mass = 1;

  this.attractions = [];
};

NP.Object.prototype = {
  constructor: NP.Object,

  setValues: function (values) {
    if (values === undefined) return;

    var keys = Object.keys(values);
    for(var i = 0, l = keys.length; i < l; i++) {
      var key = keys[i];
      var newValue = values[key];

      if (newValue === undefined) {
        console.warn( "NP.Object#setValues: '" + key + "' parameter is undefined." );
        continue;
      }

      if (key in this) {
        var currentValue = this[key];

        if (currentValue instanceof THREE.Vector3 && newValue instanceof THREE.Vector3)
          currentValue.copy( newValue );
        else
          this[ key ] = newValue;
      }
    }
  },

  applyForce: function (force) {
    if (!(force instanceof NP.Force)) throw new Error('NP.Object#applyForce: param must be a NP.Force object.');
    this.forces.push(force);
  },

  removeForce: function (name) {
    if (typeof name != 'string') throw new Error('NP.Object#removeForce: param must be a force name (string).');
    var i, len, forces=this.forces;
    for (i=0, len=this.forces.length; i<len; i++)
      if (forces[i].name == name)
        forces.splice(i, 1);
  },

  applyAttraction: function (object, parameters) {
    if (!(object instanceof NP.Object)) throw new Error('NP.Object#applyAttraction: param must be a NP.Object object.');
    var attraction = new NP.Attraction(this, object, parameters);
    this.attractions.push(attraction);
    object.attractions.push(attraction);
  },

  removeAttraction: function (name) {
    if (typeof name != 'string') throw new Error('NP.Object#removeForce: param must be a object name (string).');
    var i, l, attractions=this.attractions;
    for (i=0, l=attractions.length; i<l; i++) {
      var attraction = attractions[i];
      if (attraction.name == name) {
        if (attraction.objectA.id == this.id) {
          attractions.splice(i, 1);
          attraction.objectB._removeAttraction(name);
        }
        else {
          attractions.splice(i, 1);
          attraction.objectA._removeAttraction(name);
        }
      }
    }
  },

  _removeAttraction: function (name) {
    var i, l, attractions = this.attractions;
    for (i=0, l=this.attractions.length; i<l; i++) {
      var attraction = attractions[i];
      if (attraction.name == name) {
        attractions.splice(i, 1);
      }
    }
  }

};

NP.ObjectIdCount = 0;
/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NP.Sphere
 * @constructor
 */
NP.Sphere = function(x, y, z, radius, parameters) {
  NP.Object.call(this);
  this.position = new THREE.Vector3(x, y, z);
  this.radius = radius !== undefined ? radius : 1;

  this.setValues(parameters);
};

NP.Sphere.prototype = Object.create(NP.Object.prototype);
NP.Sphere.prototype.constructor = NP.Sphere;

NP.Sphere.prototype.renderScript = function(scene) {
  var geometry = new THREE.SphereGeometry(this.radius);
  var sphere = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
    color: Math.random() * 0xffffff,
    wireframe: true
  }));
  sphere.position.set(this.position.x, this.position.y, this.position.z);
  this.position = sphere.position;
  scene.add(sphere);
};
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
