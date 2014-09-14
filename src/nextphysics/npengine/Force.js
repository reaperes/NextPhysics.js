/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NP.Force
 * @constructor
 */
NP.Force = function(x, y, z) {
  THREE.Vector3.call( this );

  this.x = x !== undefined ? x : 0;
  this.y = y !== undefined ? y : 0;
  this.z = z !== undefined ? z : 0;
};

NP.Force.prototype = Object.create(THREE.Vector3.prototype);
NP.Force.prototype.constructor = NP.Force;

