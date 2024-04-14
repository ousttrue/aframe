import * as objectPool from './object-pool';

/**
 * Checks if two values are equal.
 * Includes objects and arrays and nested objects and arrays.
 * Try to keep this function performant as it will be called often to see if a component
 * should be updated.
 *
 * @param {object} a - First object.
 * @param {object} b - Second object.
 * @returns {boolean} Whether two objects are deeply equal.
 */
export const deepEqual = (function() {
  var arrayPool = objectPool.createPool(function() { return []; });

  return function(a, b) {
    var key;
    var keysA;
    var keysB;
    var i;
    var valA;
    var valB;

    // If not objects or arrays, compare as values.
    if (a === undefined || b === undefined || a === null || b === null ||
      !(a && b && (a.constructor === Object && b.constructor === Object) ||
        (a.constructor === Array && b.constructor === Array))) {
      return a === b;
    }

    // Different number of keys, not equal.
    keysA = arrayPool.use();
    keysB = arrayPool.use();
    keysA.length = 0;
    keysB.length = 0;
    for (key in a) { keysA.push(key); }
    for (key in b) { keysB.push(key); }
    if (keysA.length !== keysB.length) {
      arrayPool.recycle(keysA);
      arrayPool.recycle(keysB);
      return false;
    }

    // Return `false` at the first sign of inequality.
    for (i = 0; i < keysA.length; ++i) {
      valA = a[keysA[i]];
      valB = b[keysA[i]];
      // Check nested array and object.
      if ((typeof valA === 'object' || typeof valB === 'object') ||
        (Array.isArray(valA) && Array.isArray(valB))) {
        if (valA === valB) { continue; }
        if (!deepEqual(valA, valB)) {
          arrayPool.recycle(keysA);
          arrayPool.recycle(keysB);
          return false;
        }
      } else if (valA !== valB) {
        arrayPool.recycle(keysA);
        arrayPool.recycle(keysB);
        return false;
      }
    }

    arrayPool.recycle(keysA);
    arrayPool.recycle(keysB);
    return true;
  };
})();

/**
 * Computes the difference between two objects.
 *
 * @param {object} a - First object to compare (e.g., oldData).
 * @param {object} b - Second object to compare (e.g., newData).
 * @returns {object}
 *   Difference object where set of keys note which values were not equal, and values are
 *   `b`'s values.
 */
const keys = [];
export function diff(a, b, targetObject) {
  var aVal;
  var bVal;
  var bKey;
  var diff;
  var key;
  var i;
  var isComparingObjects;

  diff = targetObject || {};

  // Collect A keys.
  keys.length = 0;
  for (key in a) { keys.push(key); }

  if (!b) { return diff; }

  // Collect B keys.
  for (bKey in b) {
    if (keys.indexOf(bKey) === -1) {
      keys.push(bKey);
    }
  }

  for (i = 0; i < keys.length; i++) {
    key = keys[i];
    aVal = a[key];
    bVal = b[key];
    isComparingObjects = aVal && bVal &&
      aVal.constructor === Object && bVal.constructor === Object;
    if ((isComparingObjects && !deepEqual(aVal, bVal)) ||
      (!isComparingObjects && aVal !== bVal)) {
      diff[key] = bVal;
    }
  }
  return diff;
}
