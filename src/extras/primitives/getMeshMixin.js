/**
 * Common mesh defaults, mappings, and transforms.
 */
import { components } from '../../core/component';
import { shaders } from '../../core/shader';
import * as utils from '../../utils/';

const materialMappings = {};
Object.keys(components.material.schema).forEach(addMapping);
Object.keys(shaders.standard.schema).forEach(addMapping);

function addMapping(prop) {
  // To hyphenated.
  var htmlAttrName = prop.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  if (prop === 'fog') { htmlAttrName = 'material-fog'; }
  if (prop === 'visible') { htmlAttrName = 'material-visible'; }
  materialMappings[htmlAttrName] = 'material.' + prop;
}

export function getMeshMixin() {
  return {
    defaultComponents: { material: {} },
    mappings: Object.assign({}, materialMappings)
  };
}
