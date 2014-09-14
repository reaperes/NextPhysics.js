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
