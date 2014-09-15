/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NP.Attraction
 * @constructor
 */
NP.Attraction = function(objectA, objectB, parameters) {
  this.name = '';

  this.gravitationalConstant = 0.00000000006673;
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

  getForce: function() {
    // todo need to learn
    var v = new THREE.Vector3().subVectors(this.objectA, this.objectB);
    var distance = v.distan
    return this.gravitationalConstant * this.objectA.mass * this.objectB.mass / this.objectA.position.distanceToSquared(this.objectB.position);
  }
};
