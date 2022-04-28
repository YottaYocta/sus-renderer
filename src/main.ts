import "./style.css";

import { Renderer, Camera } from "./renderer";
import { Context } from "./context";

let renderBtn = document.getElementById("render-btn");
let canvasContainer = document.getElementById("canvas-container");
if (!renderBtn || !canvasContainer) throw "parent element do not exist";
let context = new Context(canvasContainer);
context.resize(1000, 1000);
let camera = new Camera();
let renderer = new Renderer(context, camera);

renderBtn.addEventListener("click", () => {
  renderer.configure();
  renderer.renderSphere();
});
