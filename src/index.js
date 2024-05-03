// WebVR polyfill
// Check before the polyfill runs.
window.hasNativeWebVRImplementation = !!window.navigator.getVRDisplays ||
  !!window.navigator.getVRDevices;
window.hasNativeWebXRImplementation = navigator.xr !== undefined;

// If native WebXR or WebVR are defined WebVRPolyfill does not initialize.
if (!window.hasNativeWebXRImplementation && !window.hasNativeWebVRImplementation) {
  var isIOSOlderThan10 = import('./utils/isIOSOlderThan10');
  // Workaround for iOS Safari canvas sizing issues in stereo (webvr-polyfill/issues/102).
  // Only for iOS on versions older than 10.
  var bufferScale = isIOSOlderThan10(window.navigator.userAgent) ? 1 / window.devicePixelRatio : 1;
  var WebVRPolyfill = import('webvr-polyfill');
  var polyfillConfig = {
    BUFFER_SCALE: bufferScale,
    CARDBOARD_UI_DISABLED: true,
    ROTATE_INSTRUCTIONS_DISABLED: true,
    MOBILE_WAKE_LOCK: !!window.cordova
  };
  window.webvrpolyfill = new WebVRPolyfill(polyfillConfig);
}

import * as utils from './utils/';
const debug = utils.debug;
const error = debug('A-Frame:error');
const warn = debug('A-Frame:warn');

if (window.document.currentScript && window.document.currentScript.parentNode !==
  window.document.head && !window.debug) {
  warn('Put the A-Frame <script> tag in the <head> of the HTML *before* the scene to ' +
    'ensure everything for A-Frame is properly registered before they are used from ' +
    'HTML.');
}

// Error if not using a server.
if (!window.cordova && window.location.protocol === 'file:') {
  error(
    'This HTML file is currently being served via the file:// protocol. ' +
    'Assets, textures, and models WILL NOT WORK due to cross-origin policy! ' +
    'Please use a local or hosted server: ' +
    'https://aframe.io/docs/1.4.0/introduction/installation.html#use-a-local-server.');
}

// CSS.
if (utils.device.isBrowserEnvironment) {
  import('./style/aframe.css');
  import('./style/rStats.css');
}

// Required before `AEntity` so that all components are registered.
import { AScene } from './core/scene/a-scene';
import { Component, components, registerComponent } from './core/component';
import { registerGeometry } from './core/geometry';
import { registerPrimitive } from './extras/primitives/primitives';
import { shaders, registerShader } from './core/shader';
import { systems, registerSystem } from './core/system';
// Exports THREE to window so three.js can be used without alteration.
import * as THREE from 'three';
window.THREE = THREE;
import { readyState } from './core/readyState';

import * as pkg from '../package';

import './components/index'; // Register standard components.
import './geometries/index'; // Register standard geometries.
import './shaders/index'; // Register standard shaders.
import './systems/index'; // Register standard systems.
import { ANode } from './core/a-node';
import { AEntity } from './core/a-entity'; // Depends on ANode and core components.

import './core/a-assets';
import './core/a-cubemap';
import './core/a-mixin';

// Extras.
import './extras/components/';
import './extras/primitives/';

console.log('A-Frame Version: 1.5.0 (Date 2024-05-03, Commit #9fe641ce)');
console.log('THREE Version (https://github.com/supermedium/three.js):',
  pkg.dependencies['super-three']);
console.log('WebVR Polyfill Version:', pkg.dependencies['webvr-polyfill']);

// Wait for ready state, unless user asynchronously initializes A-Frame.
if (!window.AFRAME_ASYNC) {
  readyState.waitForDocumentReadyState();
}

import { default as ANIME } from 'super-animejs';
import { geometries } from './core/geometry';
import { getMeshMixin } from './extras/primitives/getMeshMixin';
import { primitives } from './extras/primitives/primitives';
import { scenes } from './core/scene/scenes';
import * as schema from './core/schema';

export const AFRAME = window.AFRAME = {
  AComponent: Component,
  AEntity: AEntity,
  ANode: ANode,
  ANIME: ANIME,
  AScene: AScene,
  components: components,
  coreComponents: Object.keys(components),
  geometries: geometries,
  registerComponent: registerComponent,
  registerGeometry: registerGeometry,
  registerPrimitive: registerPrimitive,
  registerShader: registerShader,
  registerSystem: registerSystem,
  primitives: {
    getMeshMixin: getMeshMixin,
    primitives: primitives
  },
  scenes: scenes,
  schema: schema,
  shaders: shaders,
  systems: systems,
  emitReady: readyState.emitReady,
  THREE: THREE,
  utils: utils,
  version: pkg.version
};
