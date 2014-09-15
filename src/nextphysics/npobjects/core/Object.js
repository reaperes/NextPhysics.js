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
  this.id = ++NP.ObjectIdCount;
  this.name = '';

  this.forces = [];
  this.force = new THREE.Vector3();
  this.velocity = new THREE.Vector3();
  this.position = new THREE.Vector3();

  this.mass = 1;

  this.attractions = [];
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
  },

  removeForce: function (name) {
    if (typeof name != 'string') throw new Error('NP.Object#removeForce: param must be a force name (string).');
    var i, len, forces=this.forces;
    for (i=0, len=this.forces.length; i<len; i++)
      if (forces[i].name == name)
        forces.splice(i, 1);
  },

  applyAttraction: function (object, parameters) {
    if (!(object instanceof NP.Object)) throw new Error('NP.Object#applyAttraction: param must be a NP.Object object.');
    var attraction = new NP.Attraction(this, object, parameters);
    this.attractions.push(attraction);
    object.attractions.push(attraction);
  },

  removeAttraction: function (name) {
    if (typeof name != 'string') throw new Error('NP.Object#removeForce: param must be a object name (string).');
    var i, l, attractions=this.attractions;
    for (i=0, l=attractions.length; i<l; i++) {
      var attraction = attractions[i];
      if (attraction.name == name) {
        if (attraction.objectA.id == this.id) {
          attractions.splice(i, 1);
          attraction.objectB._removeAttraction(name);
        }
        else {
          attractions.splice(i, 1);
          attraction.objectA._removeAttraction(name);
        }
      }
    }
  },

  _removeAttraction: function (name) {
    var i, l, attractions = this.attractions;
    for (i=0, l=this.attractions.length; i<l; i++) {
      var attraction = attractions[i];
      if (attraction.name == name) {
        attractions.splice(i, 1);
      }
    }
  }

};

NP.ObjectIdCount = 0;