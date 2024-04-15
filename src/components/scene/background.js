import * as THREE from 'three';
import { registerComponent } from '../../core/component';

export const Component = registerComponent('background', {
  schema: {
    color: { type: 'color', default: 'black' },
    transparent: { default: false }
  },
  sceneOnly: true,
  update: function() {
    var data = this.data;
    var object3D = this.el.object3D;

    if (data.transparent) {
      object3D.background = null;
    } else {
      object3D.background = new THREE.Color(data.color);
    }
  },

  remove: function() {
    var object3D = this.el.object3D;
    object3D.background = null;
  }
});
