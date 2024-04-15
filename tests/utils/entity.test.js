import { assert, describe, it, expect, beforeEach } from 'vitest'
import sinon from 'sinon';
import * as helpers from '../helpers';
import { entity } from '@/utils';

const getComponentProperty = entity.getComponentProperty;
const setComponentProperty = entity.setComponentProperty;

/**
 * @vitest-environment jsdom
 */
describe('utils.entity', function() {
  let sandbox;
  beforeEach(function(done) {
    sandbox = sinon.createSandbox();
    sandbox.el = helpers.entityFactory();
    sandbox.el.addEventListener('loaded', function() {
      done();
    });
  });

  describe('getComponentProperty', function() {
    it('can get normal attribute', function() {
      sandbox.el.setAttribute('visible', true);
      assert.equal(getComponentProperty(sandbox.el, 'visible'), true);
    });

    it('can get dot-delimited attribute', function() {
      sandbox.el.setAttribute('material', { color: 'red' });
      assert.equal(getComponentProperty(sandbox.el, 'material.color'), 'red');
    });

    it('can get custom-delimited attribute', function() {
      sandbox.el.setAttribute('material', { color: 'red' });
      assert.equal(getComponentProperty(sandbox.el, 'material|color', '|'), 'red');
    });
  });

  describe('setComponentProperty', function() {
    it('can set normal attribute', function() {
      setComponentProperty(sandbox.el, 'visible', true);
      assert.equal(sandbox.el.getAttribute('visible'), true);
    });

    it('can set dot-delimited attribute', function() {
      setComponentProperty(sandbox.el, 'material.color', 'red');
      assert.equal(sandbox.el.getAttribute('material').color, 'red');
    });

    it('can get custom-delimited attribute', function() {
      setComponentProperty(sandbox.el, 'material|color', 'red', '|');
      assert.equal(sandbox.el.getAttribute('material').color, 'red');
    });
  });
});
