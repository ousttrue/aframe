import { describe, it, expect } from 'vitest';
import sinon from 'sinon';
import * as trackedControlsUtils from '@/utils/tracked-controls';

describe('onButtonEvent', function() {
  it('reemit button event based on mappings', function() {
    var mockedComponent = {
      el: { emit: sinon.stub() },
      mapping: { buttons: ['testbutton'] },
      updateModel: sinon.stub()
    };
    trackedControlsUtils.onButtonEvent(0, 'up', mockedComponent);
    expect(mockedComponent.updateModel.called).toBeTruthy();
    expect(mockedComponent.el.emit.calledWith('testbuttonup')).toBeTruthy();
  });

  it('reemit button event based on mappings with handedness', function() {
    var mockedComponent = {
      el: { emit: sinon.stub() },
      mapping: { left: { buttons: ['testbutton'] } },
      updateModel: sinon.stub()
    };
    trackedControlsUtils.onButtonEvent(0, 'up', mockedComponent, 'left');
    expect(mockedComponent.updateModel.called).toBeTruthy();
    expect(mockedComponent.el.emit.calledWith('testbuttonup')).toBeTruthy();
  });
});
