/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NP.Force
 * @constructor
 */
NP.Force = function(x, y, z, parameters) {
  THREE.Vector3.call( this );

  this.name = '';

  this.x = x !== undefined ? x : 0;
  this.y = y !== undefined ? y : 0;
  this.z = z !== undefined ? z : 0;

  this.regardlessOfMass = false;

  this.setValues(parameters);
};

NP.Force.prototype = Object.create(THREE.Vector3.prototype);
NP.Force.prototype.constructor = NP.Force;

NP.Force.prototype.setValues = function (values) {
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
};