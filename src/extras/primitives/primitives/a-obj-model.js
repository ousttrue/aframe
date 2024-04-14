import { getMeshMixin } from '../getMeshMixin';
import { registerPrimitive } from '../primitives';
import * as utils from '../../../utils/';

registerPrimitive('a-obj-model', utils.extendDeep({}, getMeshMixin(), {
  defaultComponents: {
    'obj-model': {}
  },

  mappings: {
    src: 'obj-model.obj',
    mtl: 'obj-model.mtl'
  }
}));
