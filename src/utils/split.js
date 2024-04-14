/**
 * String split with cached result.
 */
let splitCache = {};
export function split(str, delimiter) {
  if (!(delimiter in splitCache)) { splitCache[delimiter] = {}; }

  if (str in splitCache[delimiter]) { return splitCache[delimiter][str]; }

  splitCache[delimiter][str] = str.split(delimiter);
  return splitCache[delimiter][str];
}
