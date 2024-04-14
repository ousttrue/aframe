import { registerComponent } from '../core/component';

registerComponent('grabbable', {
  init: function() {
    this.el.setAttribute('obb-collider', 'centerModel: true');
  }
});
