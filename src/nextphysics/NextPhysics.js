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