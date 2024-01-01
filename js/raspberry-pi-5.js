import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import { Project } from '/js/src/project.js'
import { Context } from '/js/src/context.js'
import { Handlers } from '/js/src/handlers';

/**
 * The Raspberry project core file.
 * @module Raspberry
 */

console.group("raspberry js");

/**
 * @constant {Handlers} handlers Handlers Module as an instance.
 */
const handlers = Handlers;

/**
 * @constant {Context} context The Context Module as an instance.
 */
const context = Context;

// Add to context: clock
context.add({ 'name': "clock", 'obj': new THREE.Clock() });

/**
 * @constant {THREE.scene} scene The scene to render.
 * 
 */
const scene = Project.setStage();

/**
 * @constant {THREE.camera} camera The camera of the scene.
 * 
 */
const camera = Project.setCamera();

/**
 * @member {THREE.renderer} renderer The renderer engine instance.
 * 
 */
let renderer = false;

/**
 * @member {THREE.AnimationMixer} mixer The mixer instance.
 */
let mixer = false; 

/**
 * @member {OrbitControls} controls The Orbit Controls instance.
 */
let controls = false;

// Promise to load the gltf containing the main stage inside the scene and attach the mixer.
Project.loadGltfScene();

// Promise to load the renderer, and attach controls.
Project.setRenderer();


/**
 * Animate is the central heartbeat of all animation processes.
 * @constant
 * @function
 * @returns void
 *
 */
const animate = () => {
  requestAnimationFrame(animate);
  try {
    const delta = context.get.clock.getDelta();
    // "If" checks should pass once when the resolved promises export the variables.
    if (!mixer) {
      mixer = context.get.mixer;
      console.log(`Swapping mixer from context: ${typeof mixer}`);
    };
    if (!controls) {
      controls = context.get.controls;
      console.log(`Swapping controls from context: ${typeof controls}`);
    };
    if (!renderer) {
      renderer = context.get.renderer;
      console.log(`Swapping renderer from context: ${typeof renderer}`);
    };
    
    // natural "in scope" render steps.
    mixer.update(delta);
    TWEEN.update();
    controls.update(delta);
    Project.render();
    
    renderer.render(context.get.scene, context.get.camera);
  } catch (e) {
    console.log(`Main Animate: ${e.message} `);
  }
}

// 3D Runtime starts
animate();
console.groupEnd(); 