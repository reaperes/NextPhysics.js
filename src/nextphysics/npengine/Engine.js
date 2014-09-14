/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NP.Engine
 * @constructor
 */
NP.Engine = function(physics) {
  var objects = [];
  var pairs = [];

  this.add = function(npobject) {
    objects.push(npobject)
  };

  this.update = function(deltaT) {

  };





//    resetForce(objects);
//    solveExternalForce(objects);
//
//    resetPairs(pairs);
//    pairs = detectCollision(objects);
//    solveInternalForce(pairs);
//
//    function resetForce(objects) {
//      _.each(objects, function(object) {
//        object.resetForce();
//      });
//    }
//
//    function solveExternalForce(objects) {
//      _.each(objects, function(object) {
//        if (object.enableGravity) object.force.add(physics.gravity);
//      });
//    }
//
//    function resetPairs(pairs) {
//      pairs = [];
//    }
//
//    function detectCollision(objects) {
//      var i, j, length;
//      var pair;
//      for (i=0, length=objects.length; i<length; i++) {
//        var objA = objects[i];
//        for (j=i; j<length; j++) {
//          var objB = objects[j];
//          var distance = objA.distanceTo(objB);
//          if (objA.radius+objB.radius > distance) {
//            pair = new NP.Pairs(objA, objB);
//            pair.distance = distance;
//            pairs.append(pair);
//          }
//        }
//      }
//    }
//
//    function solveInternalForce(pairs) {
//      _.each(pairs, function(pair) {
//        var objA = pair[0];
//        var objB = pair[1];
//        objA.
//      });
//    }
//  };
};

NP.Engine.prototype.constructor = NP.Engine;



NP.Pairs = function(objectA, objectB) {
  this.objectA = objectA;
  this.objectB = objectB;
};