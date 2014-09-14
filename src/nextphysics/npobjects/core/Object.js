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
  this.mass = 1;
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
  }
};