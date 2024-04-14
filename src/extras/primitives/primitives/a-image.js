import { getMeshMixin } from '../getMeshMixin';
import { registerPrimitive } from '../primitives';
import * as utils from '../../../utils/';

registerPrimitive('a-image', utils.extendDeep({}, getMeshMixin(), {
  defaultComponents: {
    geometry: {
      primitive: 'plane'
    },
    material: {
      color: '#FFF',
      shader: 'flat',
      side: 'double',
      transparent: true
    }
  },

  mappings: {
    height: 'geometry.height',
    width: 'geometry.width'
  }
}));
