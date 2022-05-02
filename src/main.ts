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
//context.resize(40, 40);
let camera = new Camera(new Vec3(0, 0.5, 0), 1);
let renderer = new Renderer(context, camera);
renderer.add(new Sphere(1, new Vec3(2, 1, -5.2), new Vec3(1, 0.2, 0.2)));
renderer.add(new Sphere(1, new Vec3(0, 1, -5), new Vec3(0.2, 0.2, 1)));
renderer.add(new Sphere(1, new Vec3(-2, 1, -5.2), new Vec3(0.2, 1, 0.2)));
renderer.add(new Sphere(1000, new Vec3(0, -1000, -5)));

renderBtn.addEventListener("click", () => {
  renderer.configure();
  renderer.render();
});
