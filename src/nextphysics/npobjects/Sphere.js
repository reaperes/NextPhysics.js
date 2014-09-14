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