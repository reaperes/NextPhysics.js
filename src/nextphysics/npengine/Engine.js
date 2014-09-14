/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NP.Engine
 * @constructor
 */
NP.Engine = function(physics) {
  var objects = [];

  this.add = function(npobject) {
    objects.push(npobject)
  };

  this.update = function(deltaT) {
    _.each(objects, function (object, index) {
      resetForce(object);
      updateForce(object);
      updateVelocity(object, deltaT);
      updatePosition(object, deltaT);
      collisionCheck(object);
    });
  };

  function resetForce(object) {
    object.force.set(0, 0, 0);
  }

  function updateForce(object) {
    _.each(object.forces, function (force, index) {
      object.force.add(force);
    });
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