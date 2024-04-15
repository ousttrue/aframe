import { assert, describe, it, expect, beforeEach } from 'vitest';
import { coordinates } from '@/utils';

describe('utils.coordinates', function() {
  describe('isCoordinates', function() {
    it('verifies valid vec3 coordinate', function() {
      assert.ok(coordinates.isCoordinates(' 1 2.5  -3'));
    });

    it('verifies valid vec3 coordinate with e-notation', function() {
      assert.ok(coordinates.isCoordinates('1.2e3 2.5 3.4e-5'));
    });

    it('verifies valid vec4 coordinate', function() {
      assert.ok(coordinates.isCoordinates('1 1 2.5 -3'));
    });

    it('rejects invalid coordinate', function() {
      assert.notOk(coordinates.isCoordinates('1 1 2.5 -3 0.1'));
    });
  });

  describe('parse', function() {
    it('parses string', function() {
      assert.deepEqual(
        coordinates.parse('1 2.5 -3'), { x: 1, y: 2.5, z: -3 });
    });

    it('parses string, null defaultVec', function() {
      assert.deepEqual(
        coordinates.parse('1 2.5 -3', null), { x: 1, y: 2.5, z: -3 });
    });

    it('applies defaults to the missing values', function() {
      assert.deepEqual(
        coordinates.parse({ x: 1 }, { x: 0, y: 0, z: 0 }), { x: 1, y: 0, z: 0 });
    });

    it('parses null', function() {
      assert.equal(coordinates.parse(null), null);
    });

    it('can return fallback values', function() {
      var defaultCoordinate = { z: -3 };
      assert.deepEqual(coordinates.parse('1 2', defaultCoordinate),
        { x: 1, y: 2, z: -3 });
    });

    it('returns already-parsed object', function() {
      assert.deepEqual(coordinates.parse({ x: 1, y: 2, z: -3 }),
        { x: 1, y: 2, z: -3 });
    });

    it('zero value of object won\'t be overridden by defaults', function() {
      assert.deepEqual(
        coordinates.parse({ x: 0, y: 1 }, { x: 4, y: 5, z: 6 }),
        { x: 0, y: 1, z: 6 });
    });

    it('parses object with strings', function() {
      assert.deepEqual(coordinates.parse({ x: '1', y: '2', z: -3 }),
        { x: 1, y: 2, z: -3 });
    });
  });

  describe('stringify', function() {
    it('stringifies a vec2', function() {
      assert.equal(coordinates.stringify({ x: 1, y: 2 }), '1 2');
    });

    it('stringifies a vec3', function() {
      assert.equal(coordinates.stringify({ x: 1, y: 2, z: -3 }), '1 2 -3');
    });
    it('stringifies a zeroed vec3', function() {
      assert.equal(coordinates.stringify({ x: 0, y: 0, z: 0 }), '0 0 0');
    });

    it('stringifies a vec4', function() {
      assert.equal(coordinates.stringify({ x: 1, y: 2, z: -3, w: -4 }), '1 2 -3 -4');
    });

    it('stringifies a zeroed vec4', function() {
      assert.equal(coordinates.stringify({ x: 0, y: 0, z: 0, w: 0 }), '0 0 0 0');
    });

    it('returns already-stringified string', function() {
      assert.equal(coordinates.stringify('1 2 -3'), '1 2 -3');
    });
  });
});
