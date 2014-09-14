/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * Utility class
 *
 * @class NP.Util
 * @constructor
 */
NP.Util = function() {
  /**
   *  return if it is integer
   *
   *  @method isInt
   *  @param n
   *  @return {boolean}
   */
  this.isInt = function(n) {
    return typeof n === 'number' && n % 1 === 0;
  };

//  /**
//   *  Convert int to float number
//   *
//   *  @method intToFloat
//   *  @param n {number}
//   *  @return {number} float number
//   */
//  this.intToFloat = function(n) {
//    var f:float = n;
//    return f;
//  }
};
