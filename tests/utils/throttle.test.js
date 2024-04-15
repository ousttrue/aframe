import { describe, it, expect } from 'vitest'
import sinon from 'sinon';
import { throttle } from '@/utils';

describe('utils.throttle', function() {
  var ts;
  var dts;
  var interval = 1000;
  var functionToThrottle = function(t, dt) { ts.push(t); dts.push(dt); };
  var throttleFn;
  var arbitraryLargeTime = 987634578;
  var arbitraryLargeDelta = 12345;

  it('fires callback on first tick whatever', function() {
    ts = [];
    dts = [];
    expect(ts.length).toEqual(0);
    expect(dts.length).toEqual(0);
    throttleFn = throttle(functionToThrottle, interval);
    throttleFn(arbitraryLargeTime, arbitraryLargeDelta);
    expect(ts.length).toEqual(1);
    expect(ts[0]).toEqual(arbitraryLargeTime);
    expect(dts.length).toEqual(1);
    expect(dts[0]).toEqual(arbitraryLargeDelta);
  });

  it('fires callback on first tick zero', function() {
    ts = [];
    dts = [];
    expect(ts.length).toEqual(0);
    expect(dts.length).toEqual(0);
    throttleFn = throttle(function(t, dt) { ts.push(t); dts.push(dt); }, interval);
    throttleFn(0, arbitraryLargeDelta);
    expect(ts.length).toEqual(1);
    expect(ts[0]).toEqual(0);
    expect(dts.length).toEqual(1);
    expect(dts[0]).toEqual(arbitraryLargeDelta);
  });

  // need to wait for wall clock time, so skip this
  it.skip('does not fire callback on ticks too soon', function() {
    var tlen = ts.length;
    var dtlen = dts.length;
    expect(ts.length).toEqual(dts.length);
    throttleFn(1);
    expect(ts.length).toEqual(tlen);
    expect(dts.length).toEqual(dtlen);
    throttleFn(interval / 2);
    expect(ts.length).toEqual(tlen);
    expect(dts.length).toEqual(dtlen);
    throttleFn(interval - 1);
    expect(ts.length).toEqual(tlen);
    expect(dts.length).toEqual(dtlen);
  });

  // need to wait for wall clock time
  it('does fire callback on ticks after enough', function() {
    var tlen = ts.length;
    var dtlen = dts.length;
    expect(ts.length).toEqual(dts.length);
    setTimeout(function() {
      throttleFn(interval);
      expect(ts.length).toEqual(tlen + 1);
      expect(ts[tlen] - ts[tlen - 1] >= interval).toBeTruthy();
      expect(dts.length).toEqual(dtlen + 1);
      expect(ts[tlen] - ts[tlen - 1] === dts[tlen]).toBeTruthy();
    }, interval);
  });

  // need to wait for wall clock time, so skip this
  it.skip('fires only one callback on multiply late ticks', function() {
    var tlen = ts.length;
    var dtlen = dts.length;
    expect(ts.length).toEqual(dts.length);
    throttleFn(interval * 5);
    expect(ts.length).toEqual(tlen + 1);
    expect(ts[tlen] - ts[tlen - 1] >= interval).toBeTruthy();
    expect(dts.length).toEqual(dtlen + 1);
    expect(ts[tlen] - ts[tlen - 1] === dts[tlen]).toBeTruthy();
    throttleFn(interval * 9);
    expect(ts.length).toEqual(tlen + 2);
    expect(ts[tlen + 1] - ts[tlen] >= interval).toBeTruthy();
    expect(dts.length).toEqual(dtlen + 2);
    expect(ts[tlen + 1] - ts[tlen] === dts[tlen + 1]).toBeTruthy();
  });

  it('binds function if context given', function() {
    var obj = {};
    obj.functionToThrottle = function(t, dt) { this.t = t; this.dt = dt; };
    var spy = sinon.spy(obj, 'functionToThrottle');
    obj.functionToThrottle = throttle(obj.functionToThrottle, interval, obj);
    obj.functionToThrottle(arbitraryLargeTime, arbitraryLargeDelta);
    expect(spy.calledOnce).toBeTruthy();
    expect(spy.calledWith(arbitraryLargeTime, arbitraryLargeDelta)).toBeTruthy();
    expect(obj.t).toEqual(arbitraryLargeTime);
    expect(obj.dt).toEqual(arbitraryLargeDelta);
  });
});
