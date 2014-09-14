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