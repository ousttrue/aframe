import * as THREE from 'three';
import * as  utils from './utils/';
// Required before `AEntity` so that all components are registered.
import { AScene } from './core/scene/a-scene';
import { components, registerComponent } from './core/component';
import { registerGeometry } from './core/geometry';
import { primitives as _prim, registerPrimitive } from './extras/primitives/primitives';
import { shaders, registerShader } from './core/shader';
import { systems, registerSystem } from './core/system';
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

import * as getMeshMixin from './extras/primitives/getMeshMixin';

// WebVR polyfill
// Check before the polyfill runs.
window.hasNativeWebVRImplementation = !!window.navigator.getVRDisplays ||
  !!window.navigator.getVRDevices;
window.hasNativeWebXRImplementation = navigator.xr !== undefined;

// If native WebXR or WebVR are defined WebVRPolyfill does not initialize.
if (!window.hasNativeWebXRImplementation && !window.hasNativeWebVRImplementation) {
  var isIOSOlderThan10 = require('./utils/isIOSOlderThan10');
  // Workaround for iOS Safari canvas sizing issues in stereo (webvr-polyfill/issues/102).
  // Only for iOS on versions older than 10.
  var bufferScale = isIOSOlderThan10(window.navigator.userAgent) ? 1 / window.devicePixelRatio : 1;
  var WebVRPolyfill = require('webvr-polyfill');
  var polyfillConfig = {
    BUFFER_SCALE: bufferScale,
    CARDBOARD_UI_DISABLED: true,
    ROTATE_INSTRUCTIONS_DISABLED: true,
    MOBILE_WAKE_LOCK: !!window.cordova
  };
  window.webvrpolyfill = new WebVRPolyfill(polyfillConfig);
}

var debug = utils.debug;
var error = debug('A-Frame:error');
var warn = debug('A-Frame:warn');

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

console.log('A-Frame Version: 1.5.0 (Date 2024-04-10, Commit #d8ef6575)');
console.log('THREE Version (https://github.com/supermedium/three.js):',
  pkg.dependencies['super-three']);
console.log('WebVR Polyfill Version:', pkg.dependencies['webvr-polyfill']);

// Wait for ready state, unless user asynchronously initializes A-Frame.
if (!window.AFRAME_ASYNC) {
  readyState.waitForDocumentReadyState();
}

export { Component as AComponent } from './core/component';
export { AEntity };
export { ANode };
export * as ANIME from 'super-animejs';
export { AScene };
export { components };
export const coreComponents = Object.keys(components);
export { geometries } from './core/geometry';
export { registerComponent };
export { registerGeometry };
export { registerPrimitive };
export { registerShader };
export { registerSystem };
export const primitives = {
  getMeshMixin,
  primitives: _prim
};
export { scenes } from './core/scene/scenes';
export * as schema from './core/schema';
export { shaders };
export { systems };
export const emitReady = readyState.emitReady;
export { utils };
export const version = pkg.version;
