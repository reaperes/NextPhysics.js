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
  var updateFunctions = [];

  // init renderer
  renderer.setClearColor(new THREE.Color(0x000000));
  renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
  canvasContainer.appendChild(renderer.domElement);

  var camera = new THREE.PerspectiveCamera(45, canvasContainer.offsetWidth / canvasContainer.offsetHeight, 0.001, 10000);
  camera.position.z = 500;
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
  var light = new THREE.DirectionalLight(0xffffff, 0.6);
  light.position.set(5, 3, 5);
  scene.add(light);
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
