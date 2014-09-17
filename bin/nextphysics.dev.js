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

NextPhysics = function (canvasContainer, parameters) {
  // prevent right mouse click
  document.oncontextmenu = document.body.oncontextmenu = function() {return false;};

  var engine = new NP.Engine(this);
  var renderer = new NP.Renderer(canvasContainer);
  var camera = renderer.camera;

  this.forces = [];

  this.deltaT = 1;

  this.setValues(parameters);

  this.add = function (npobject) {
    engine.add(npobject);
    renderer.add(npobject);
  };

  /****************************************************
   * Physics loop
   ****************************************************/

  this.update = function () {
    engine.update(this.deltaT);
  };

  this.render = function () {
    controls.update();
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
        this.forces.push(value);
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
        var j, m, forces=this.forces;
        for (j=0, m=this.forces.length; j<m; j++)
          if (forces[j].name == name)
            forces.splice(j, 1);
      }
    }
  };

  /****************************************************
   * Control camera
   ****************************************************/
  var controls = new THREE.TrackballControls(camera);
  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;
  controls.noZoom = false;
  controls.noPan = false;
  controls.staticMoving = true;
  controls.dynamicDampingFactor = 0.3;

  this.setCameraPosition = function (x, y, z) {
    camera.position.set(x, y, z);
  }
};

NextPhysics.prototype.constructor = NextPhysics;
NextPhysics.prototype.setValues = function (values) {
  if (values === undefined) return;
  var keys = Object.keys(values);
  for(var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    var newValue = values[key];

    if (newValue === undefined) {
      console.warn("NextPhysics: '" + key + "' parameter is undefined.");
      continue;
    }

    if (key in this)
      this[ key ] = newValue;
  }
};
/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NP.Attraction
 * @constructor
 */
NP.Attraction = function(objectA, objectB, parameters) {
  this.name = '';

//  this.gravitationalConstant = 0.00000000006673;
  this.gravitationalConstant = 1.181e-19;
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

  getForceAB: function() {
    var force = new THREE.Vector3().subVectors(this.objectB.position, this.objectA.position);
    var strength = this.gravitationalConstant * this.objectA.mass * this.objectB.mass / this.objectA.position.distanceToSquared(this.objectB.position);
    return force.normalize().multiplyScalar(strength);
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
    var i, l, object;
    for (i=0, l=objects.length; i<l; i++)
      resetForce(objects[i]);

    for (i=0; i<l; i++)
      updateForce(objects[i]);

    for (i=0; i<l; i++) {
      object = objects[i];
      updateVelocity(object, deltaT);
      updatePosition(object, deltaT);
//      checkEdges(object);
    }
  };

  function resetForce(object) {
    object.force.set(0, 0, 0);
  }

  function updateForce(object) {
    var i, l;

    // update global force
    var forces = physics.forces;
    var force = object.force;
    for (i=0, l=forces.length; i<l; i++) {
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

    // update singular force
    forces = object.forces;
    force = object.force;
    for (i=0, l=forces.length; i<l; i++) {
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

    // update attraction force
    var attractions = object.attractions;
    for (i=0, l=attractions.length; i<l; i++) {
      var attraction = attractions[i];
      if (attraction.objectA.id != object.id)
        continue;

      var af = attraction.getForceAB();
      force.x += af.x / object.mass;
      force.y += af.y / object.mass;
      force.z += af.z / object.mass;

      var objectB = attraction.objectB;
      var objectBForce = objectB.force;
      objectBForce.x -= af.x / objectB.mass;
      objectBForce.y -= af.y / objectB.mass;
      objectBForce.z -= af.z / objectB.mass;
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

//  function checkEdges(object) {
//    if (object.position.y < 0) {
//      object.velocity.y = Math.abs(object.velocity.y);
//      object.position.y = 0;
//    }
//  }
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
 * Next physics renderer
 *
 * @class NP.Renderer
 * @constructor
 * @param canvasContainer {HTMLDivElement}
 */
NP.Renderer = function(canvasContainer) {
  var renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
  var scene = new THREE.Scene();
  this.scene = scene;
  var updateFunctions = [];

  // init renderer
  renderer.setClearColor(new THREE.Color(0x000000));
  renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
  canvasContainer.appendChild(renderer.domElement);

  var camera = new THREE.PerspectiveCamera(45, canvasContainer.offsetWidth / canvasContainer.offsetHeight, 0.001, 10000);
  camera.position.z = 100;
  this.camera = camera;

  // Grid
//  var material = new THREE.LineBasicMaterial( { color: 0xa0a0a0} );
//  var geometry = new THREE.Geometry();
//  var floor = -0.04, step = 1, size = 14;
//  for ( var i = 0; i <= size / step * 2; i ++ ) {
//    geometry.vertices.push( new THREE.Vector3( - size, floor, i * step - size ) );
//    geometry.vertices.push( new THREE.Vector3(   size, floor, i * step - size ) );
//    geometry.vertices.push( new THREE.Vector3( i * step - size, floor, -size ) );
//    geometry.vertices.push( new THREE.Vector3( i * step - size, floor,  size ) );
//  }
//  var line = new THREE.Line( geometry, material, THREE.LinePieces );
//  scene.add( line );

  // lights
  scene.add(new THREE.AmbientLight(0x333333));
//  scene.add(new THREE.AmbientLight(0xffffff));



//  var light = new THREE.DirectionalLight(0xffffff, 0.6);
//  light.position.set(0, 0, 0);
//  light.target.position.set(10, 10, 0);
//  scene.add(light);


//  var spotLight = new THREE.SpotLight( 0xffffff );
//  spotLight.position.set( 100, 1000, 100 );
//  spotLight.castShadow = true;
//  spotLight.shadowMapWidth = 1024;
//  spotLight.shadowMapHeight = 1024;
//  spotLight.shadowCameraNear = 500;
//  spotLight.shadowCameraFar = 4000;
//  spotLight.shadowCameraFov = 30;
//  scene.add( spotLight );

//  var spotlight = new THREE.SpotLight(0xffffff, 0.6);
//  spotlight.position.set(0, 0, 0);
//  scene.add(spotlight);

//  var light = new THREE.PointLight(0xEEEEEE);
//  light.position.set(20, 0, 20);
//  scene.add(light);

  // axes
  var axes = new THREE.AxisHelper( 1000 );
  scene.add(axes);

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
      segments: 16
    };

    object.renderScript(scene, renderOptions, updateFunctions);
  };
};

NP.Renderer.prototype.constructor = NP.Renderer;
