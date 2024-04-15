import { describe, it, expect } from 'vitest'
import { bind } from '@/utils';

describe('utils.bind', function() {
  it('utils.bind binds to object', function() {
    var obj = {
      propName: 'aframe',
      getProp: function() {
        return this.propName;
      }
    };
    expect(obj.getProp()).toEqual(bind(obj.getProp, obj)());
  });

  it('utils.bind binds properly when called by other object', function() {
    var obj = {
      propName: 'aframe',
      getProp: function() {
        return this.propName;
      },
      getPropByCallback: function(cb) {
        return cb();
      }
    };
    var obj2 = {
      propName: 'webvr'
    };
    var bound = bind(obj.getProp, obj2);
    expect(obj2.propName).toEqual(bound());
    expect(obj2.propName).toEqual(obj.getPropByCallback(bound));
  });

  it('utils.bind accepts and handles additional arguments properly', function() {
    var firstArg = 'awesome';
    var secondArg = {};
    var obj = {
      propName: 'aframe',
      getPropertyByCallback: function(arg1, arg2, arg3) {
        expect(arg1).toEqual(firstArg);
        expect(arg2).toEqual(secondArg);
        expect(arg3).toEqual(obj.propName);
      }
    };
    var bound = bind(obj.getPropertyByCallback, obj, firstArg, secondArg);
    bound(obj.propName);
  });
});
