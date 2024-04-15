/**
 * Automated mesh primitive registration.
 */
import { getMeshMixin } from '../getMeshMixin';
import { geometries, geometryNames } from '../../../core/geometry';
import { registerPrimitive } from '../primitives';
import * as utils from '../../../utils/';

// For testing.
export const meshPrimitives = {};

// Generate primitive for each geometry type.
geometryNames.forEach(function registerMeshPrimitive(geometryName) {
  var geometry = geometries[geometryName];
  var geometryHyphened = unCamelCase(geometryName);

  // Generate mappings.
  var mappings = {};
  Object.keys(geometry.schema).forEach(function createMapping(property) {
    mappings[unCamelCase(property)] = 'geometry.' + property;
  });

  // Register.
  var tagName = 'a-' + geometryHyphened;
  var primitive = registerPrimitive(tagName, utils.extendDeep({}, getMeshMixin(), {
    defaultComponents: { geometry: { primitive: geometryName } },
    mappings: mappings
  }));
  meshPrimitives[tagName] = primitive;
});

/**
 * camelCase to hyphened-string.
 */
function unCamelCase(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}
