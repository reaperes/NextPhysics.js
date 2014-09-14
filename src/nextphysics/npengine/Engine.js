/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NP.Engine
 * @constructor
 */
NP.Engine = function(physics) {
  var objects = [];
  this.objects = objects;

  this.add = function(object) {
    objects.push(object);
  };

  this.update = function(deltaT) {
    var i, len;
    for (i=0, len=objects.length; i<len; i++) {
      var object = objects[i];
      resetForce(object);
      updateForce(object);
      updateVelocity(object, deltaT);
      updatePosition(object, deltaT);
      collisionCheck(object);
    }
  };

  function resetForce(object) {
    object.force.set(0, 0, 0);
  }

  function updateForce(object) {
    var i, len;
    var forces = object.forces;
    var force = object.force;
    for (i=0, len=forces.length; i<len; i++) {
      if (forces[i].regardlessOfMass)
        force.add(forces[i]);
      else {
        if (object.mass != 0) {
          force.x += forces[i].x / object.mass;
          force.y += forces[i].y / object.mass;
          force.z += forces[i].z / object.mass;
        }
      }
    }
  }

  function updateVelocity(object, deltaT) {
    object.velocity.x += object.force.x * deltaT;
    object.velocity.y += object.force.y * deltaT;
    object.velocity.z += object.force.z * deltaT;
  }

  function updatePosition(object, deltaT) {
    object.position.x += object.velocity.x * deltaT;
    object.position.y += object.velocity.y * deltaT;
    object.position.z += object.velocity.z * deltaT;
  }

  function collisionCheck(object) {
    if (object.position.y < 0) {
      object.velocity.y = Math.abs(object.velocity.y);
      object.position.y = 0;
    }
  }
};

NP.Engine.prototype.constructor = NP.Engine;