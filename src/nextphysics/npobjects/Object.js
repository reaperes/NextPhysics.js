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
  this.forces = [];
  this.force = new THREE.Vector3();
  this.velocity = new THREE.Vector3();
  this.position = new THREE.Vector3();
};

NP.Object.prototype = {
  constructor: NP.Object,
  applyForce: function (force) {
    if (!(force instanceof NP.Force)) throw new Error('NP.Object#applyForce: param must be a NP.Force object.');
    this.forces.push(force);
  }
};