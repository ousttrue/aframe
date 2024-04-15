import { assert, describe, it, expect, beforeEach } from 'vitest'
import { diff, deepEqual } from '@/utils';

/**
 * @vitest-environment jsdom
 */
describe('utils.objects', function() {
  describe('diff', function() {
    it('can diff identical objects', function() {
      var objA = { scale: { x: 1, y: 2, z: 3 }, width: 10 };
      var objB = { scale: { x: 1, y: 2, z: 3 }, width: 10 };
      assert.deepEqual(diff(objA, objB), {});
    });

    it('can diff nested objects', function() {
      var objA = { position: { x: 1, y: 2, z: 3 } };
      var objB = { position: { x: 4, y: 5, z: 6 } };
      assert.deepEqual(diff(objA, objB), {
        position: objB.position
      });
    });

    it('can diff primitives', function() {
      var objA = { height: 10 };
      var objB = { height: 20 };
      assert.deepEqual(diff(objA, objB), {
        height: 20
      });
    });

    it('can diff when key exists in A but not in B', function() {
      var objA = { primitive: 'sphere' };
      var objB = {};
      assert.deepEqual(diff(objA, objB), {
        primitive: undefined
      });
    });

    it('can diff when key exists in B but not in A', function() {
      var objA = {};
      var objB = { primitive: 'sphere' };
      assert.deepEqual(diff(objA, objB), {
        primitive: 'sphere'
      });
    });

    it('can cross-diff existing keys', function() {
      var objA = { metallic: 0.5 };
      var objB = { roughness: 1 };
      assert.deepEqual(diff(objA, objB), {
        metallic: undefined,
        roughness: 1
      });
    });
  });

  describe('deepEqual', function() {
    it('can compare identical objects', function() {
      var objA = { id: 62, label: 'Foo', parent: null };
      var objB = { id: 62, label: 'Foo', parent: null };
      assert.ok(deepEqual(objA, objB));
    });

    it('can compare strings', function() {
      var valA = 'abc';
      var valB = 'abc';
      var valC = 'def';
      assert.ok(deepEqual(valA, valB));
      assert.notOk(deepEqual(valA, valC));
    });

    it('can compare numbers', function() {
      var valA = 1;
      var valB = 1;
      var valC = 2;
      assert.ok(deepEqual(valA, valB));
      assert.notOk(deepEqual(valA, valC));
    });

    it('can compare for missing properties', function() {
      var objA = { id: 62, label: 'Foo', parent: null };
      var objB = { id: 62, label: 'Foo', parent: null, extraProp: true };
      assert.notOk(deepEqual(objA, objB));
    });

    it('can compare for differing property values', function() {
      var objA = { id: 62, label: 'Foo', parent: null, extraProp: false };
      var objB = { id: 62, label: 'Foo', parent: null, extraProp: true };
      assert.notOk(deepEqual(objA, objB));
    });

    it('can compare nested arrays', function() {
      var objA = { children: [1, 2, 3, 4] };
      var objB = { children: [1, 2, 3, 4] };
      var objC = { children: [1, 2, 3, 5] };
      assert.ok(deepEqual(objA, objB));
      assert.notOk(deepEqual(objA, objC));
    });

    it('can compare nested objects', function() {
      var objA = { metadata: { source: 'Wikipedia, 2016' } };
      var objB = { metadata: { source: 'Wikipedia, 2016' } };
      var objC = { metadata: { source: 'Nature, 2015' } };
      assert.ok(deepEqual(objA, objB));
      assert.notOk(deepEqual(objA, objC));
    });

    it('can compare vec3s', function() {
      var objA = { x: 0, y: 0, z: 0 };
      var objB = { x: 0, y: 0, z: 0 };
      var objC = { x: 1, y: 2, z: 3 };
      assert.ok(deepEqual(objA, objB));
      assert.notOk(deepEqual(objA, objC));
    });

    it('can compare with null', function() {
      assert.ok(deepEqual(null, null));
      assert.notOk(deepEqual(null, {}));
    });

    it('can compare empty objects', function() {
      assert.ok(deepEqual({}, {}));
      assert.notOk(deepEqual({}, { a: 1 }));
    });

    it('can compare the same object with self reference', function() {
      var objA = { x: 0, y: 0, z: 0 };
      objA.self = objA;
      assert.ok(deepEqual(objA, objA));
    });

    it('avoid deep equal of object that are not instantiated' +
      'with the Object constructor in order to avoid infinite loops', function() {
        assert.notOk(deepEqual(document.createElement('a-entity'),
          document.createElement('a-entity')));
      });

    it('can compare if any of the arguments is undefined', function() {
      assert.notOk(deepEqual(undefined, { a: 1, b: 2 }));
      assert.notOk(deepEqual({ a: 1, b: 2 }, undefined));
      assert.ok(deepEqual(undefined, undefined));
    });
  });
});
