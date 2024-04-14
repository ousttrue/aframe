import {registerComponent} from '../core/component';

/**
 * Visibility component.
 */
export const Component = registerComponent('visible', {
  schema: {default: true},

  update: function () {
    this.el.object3D.visible = this.data;
  }
});
