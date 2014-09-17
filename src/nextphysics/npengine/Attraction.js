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
