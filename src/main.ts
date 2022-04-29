import "./style.css";

import { Renderer, Camera } from "./renderer";
import { Context } from "./context";
import { Vec3 } from "./utils";
import { Sphere } from "./primitives";

let renderBtn = document.getElementById("render-btn");
let canvasContainer = document.getElementById("canvas-container");
if (!renderBtn || !canvasContainer) throw "parent element do not exist";
let context = new Context(canvasContainer);
context.resize(1000, 1000);
let camera = new Camera(new Vec3(0, 0.5, 0), 1);
let renderer = new Renderer(context, camera);
renderer.add(new Sphere(1, new Vec3(0, 1, -5)));
renderer.add(new Sphere(1000, new Vec3(0, -1000, -5)));

renderBtn.addEventListener("click", () => {
  renderer.configure();
  renderer.render();
});
