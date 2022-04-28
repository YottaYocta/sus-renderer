import "./style.css";

import { Renderer, Camera } from "./renderer";
import { Context } from "./context";

let renderBtn = document.getElementById("render-btn");
let canvasContainer = document.getElementById("canvas-container");
let context = new Context(canvasContainer);
let camera = new Camera();
let renderer = new Renderer(context, camera);

renderBtn.addEventListener("click", () => {
  renderer.configure();
  renderer.renderSphere();
});
