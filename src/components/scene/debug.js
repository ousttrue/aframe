import { registerComponent } from '../../core/component';

export const Component = registerComponent('debug', {
  schema: { default: true },
  sceneOnly: true
});
