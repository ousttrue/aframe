const components = require('./component');
const schema = require('./schema');
const utils = require('../utils/');
const ready = require('./readyState');

const parseProperties = schema.parseProperties;
const parseProperty = schema.parseProperty;
const processSchema = schema.process;
const isSingleProp = schema.isSingleProperty;
const styleParser = utils.styleParser;

const systems = module.exports.systems = {};  // Keep track of registered systems.

/**
 * System class definition.
 *
 * Systems provide global scope and services to a group of instantiated components of the
 * same class. They can also help abstract logic away from components such that components
 * only have to worry about data.
 *
 * For example, a physics component that creates a physics world that oversees
 * all entities with a physics or rigid body component.
 *
 * TODO: Have the System prototype reuse the Component prototype. Most code is copied
 * and some pieces are missing from the Component facilities (e.g., attribute caching,
 * setAttribute behavior).
 *
 * @member {string} name - Name that system is registered under.
 * @member {Element} sceneEl - Handle to the scene element where system applies to.
 */
class System {
  constructor(sceneEl) {
    const component = components && components.components[this.name];

    // Set reference to scene.
    this.el = sceneEl;
    this.sceneEl = sceneEl;

    // Set reference to matching component (if exists).
    if (component) { component.Component.prototype.system = this; }

    // Process system configuration.
    this.buildData();
    this.init();
    this.update({});
  }

  /**
   * Init handler. Called during scene initialization and is only run once.
   * Systems can use this to set initial state.
   */
  init() { /* no-op */ }

  /**
   * Update handler. Called during scene attribute updates.
   * Systems can use this to dynamically update their state.
   */
  update(oldData) { /* no-op */ }

  /**
   * Build data and call update handler.
   *
   * @private
   */
  updateProperties(rawData) {
    const oldData = this.data;
    if (!Object.keys(schema).length) { return; }
    this.buildData(rawData);
    this.update(oldData);
  }

  /**
   * Parse data.
   */
  buildData(rawData) {
    const schema = this.schema;
    if (!Object.keys(schema).length) { return; }
    rawData = rawData || window.HTMLElement.prototype.getAttribute.call(this.sceneEl, this.name);
    if (isSingleProp(schema)) {
      this.data = parseProperty(rawData, schema);
    } else {
      this.data = parseProperties(styleParser.parse(rawData) || {}, schema, false, this.name);
    }
  }

  /**
   * Tick handler.
   * Called on each tick of the scene render loop.
   * Affected by play and pause.
   *
   * @param {number} time - Scene tick time.
   * @param {number} timeDelta - Difference in current render time and previous render time.
   */
  tick(time, timeDelta) { }

  /**
   * Tock handler.
   * Called on each tock of the scene render loop.
   * Affected by play and pause.
   *
   * @param {number} time - Scene tick time.
   * @param {number} timeDelta - Difference in current render time and previous render time.
   */
  tock(time, timeDelta) { }

  /**
   * Called to start any dynamic behavior (e.g., animation, AI, events, physics).
   */
  play() { /* no-op */ }

  /**
   * Called to stop any dynamic behavior (e.g., animation, AI, events, physics).
   */
  pause() { /* no-op */ }
}
module.exports.System = System;

/**
 * Registers a system to A-Frame.
 *
 * @param {string} name - Component name.
 * @param {object} definition - Component property and methods.
 * @param {object} schema - Contains the type schema and defaults for the data values. Data is coerced into the types of the values of the defaults.
 * @returns {object} Component.
 */
module.exports.registerSystemClass = function(name, NewSystem, schema = {}) {
  if (systems[name]) {
    throw new Error('The system `' + name + '` has been already registered. ' +
      'Check that you are not loading two versions of the same system ' +
      'or two different systems of the same name.');
  }

  NewSystem.prototype.name = name;
  NewSystem.prototype.schema = utils.extend(processSchema(schema));
  systems[name] = NewSystem;

  // Initialize systems for existing scenes
  if (ready.canInitializeElements) {
    const scenes = utils.findAllScenes(document);
    for (let i = 0; i < scenes.length; i++) {
      scenes[i].initSystem(name);
    }
  }
};

/**
 * Registers a system to A-Frame.
 *
 * @param {string} name - Component name.
 * @param {object} definition - Component property and methods.
 * @returns {object} Component.
 */
module.exports.registerSystem = function(name, definition) {
  class NewSystem extends System { }
  Object.keys(definition).forEach(function(key) {
    // Format definition object to prototype object.
    Object.defineProperty(NewSystem.prototype, key,
      {
        value: definition[key],
        writable: true
      });
  });

  module.exports.registerSystemClass(name, NewSystem, NewSystem.prototype.schema);
};
