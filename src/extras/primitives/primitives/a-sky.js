import { getMeshMixin } from '../getMeshMixin';
import { registerPrimitive } from '../primitives';
import * as utils from '../../../utils/';
import { meshPrimitives } from './meshPrimitives';

registerPrimitive('a-sky', utils.extendDeep({}, getMeshMixin(), {
  defaultComponents: {
    geometry: {
      primitive: 'sphere',
      radius: 500,
      segmentsWidth: 64,
      segmentsHeight: 32
    },
    material: {
      color: '#FFF',
      side: 'back',
      shader: 'flat',
      npot: true
    },
    scale: '-1 1 1'
  },

  mappings: utils.extendDeep({}, meshPrimitives['a-sphere'].mappings)
}));
