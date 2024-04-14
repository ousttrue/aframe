import { registerComponent } from '../../core/component';
import { RStats } from '../../../vendor/rStats';
import * as utils from '../../utils';
import '../../../vendor/rStats.extras';
import '../../lib/rStatsAframe';

const AFrameStats = window.aframeStats;
const HIDDEN_CLASS = 'a-hidden';
const ThreeStats = window.threeStats;

/**
 * Stats appended to document.body by RStats.
 */
export const Component = registerComponent('stats', {
  schema: { default: true },

  sceneOnly: true,

  init: function() {
    var scene = this.el;

    if (utils.getUrlParameter('stats') === 'false') { return; }

    this.stats = createStats(scene);
    this.statsEl = document.querySelector('.rs-base');

    this.hideBound = this.hide.bind(this);
    this.showBound = this.show.bind(this);

    scene.addEventListener('enter-vr', this.hideBound);
    scene.addEventListener('exit-vr', this.showBound);
  },

  update: function() {
    if (!this.stats) { return; }
    return (!this.data) ? this.hide() : this.show();
  },

  remove: function() {
    this.el.removeEventListener('enter-vr', this.hideBound);
    this.el.removeEventListener('exit-vr', this.showBound);
    if (!this.statsEl) { return; }  // Scene detached.
    this.statsEl.parentNode.removeChild(this.statsEl);
  },

  tick: function() {
    var stats = this.stats;

    if (!stats) { return; }

    stats('rAF').tick();
    stats('FPS').frame();
    stats().update();
  },

  hide: function() {
    this.statsEl.classList.add(HIDDEN_CLASS);
  },

  show: function() {
    this.statsEl.classList.remove(HIDDEN_CLASS);
  }
});

function createStats(scene) {
  var threeStats = new ThreeStats(scene.renderer);
  var aframeStats = new AFrameStats(scene);
  var plugins = scene.isMobile ? [] : [threeStats, aframeStats];
  return new RStats({
    css: [],  // Our stylesheet is injected from `src/index.js`.
    values: {
      fps: { caption: 'fps', below: 30 }
    },
    groups: [
      { caption: 'Framerate', values: ['fps', 'raf'] }
    ],
    plugins: plugins
  });
}
