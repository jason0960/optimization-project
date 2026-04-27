import { Controls } from './renderer/components/controls.js';

const controls = new Controls(document.getElementById('controls-container'));
controls.render();

// TODO: import { Renderer } from './renderer/index.js';

// TODO: Grab DOM containers:
//   - #controls-container  -> parameter / item entry form
//   - #scene-container     -> Three.js pallet viewer
//   - #results-container   -> summary metrics + item list

// TODO: Instantiate Renderer with the containers and call renderer.init()

// TODO: Optional — expose renderer on window for debugging in dev only

