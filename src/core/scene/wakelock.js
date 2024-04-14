import * as Wakelock from '../../../vendor/wakelock/wakelock';

export default function initWakelock(scene) {
  if (!scene.isMobile) { return; }

  var wakelock = scene.wakelock = new Wakelock();
  scene.addEventListener('enter-vr', function() { wakelock.request(); });
  scene.addEventListener('exit-vr', function() { wakelock.release(); });
}
