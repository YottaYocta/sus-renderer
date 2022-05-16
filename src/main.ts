import "./style.css";

import { Renderer, Camera } from "./renderer";
import { Context } from "./context";
import { Vec3 } from "./utils";
import { Sphere, Plane, Material } from "./renderable";

let renderBtn = document.getElementById("render-btn");
let canvasContainer = document.getElementById("canvas-container");
if (!renderBtn || !canvasContainer) throw "parent element do not exist";
let context = new Context(canvasContainer);
//context.resize(1000, 1000);
//context.resize(400, 400);
context.resize(100, 100);
//context.resize(40, 40);
let camera = new Camera(new Vec3(0, 0.5, 0), 1);
let renderer = new Renderer(context, camera);
renderer.samples = 5;
renderer.light = new Sphere(3, new Vec3(5, 7, 0));
renderer.lightIntensity = 25;
renderer.worldColor = new Vec3();
// body
renderer.add(
  new Sphere(
    1,
    new Vec3(0, 1.5, -3),
    new Material(new Vec3(0.7, 0.2, 0.2), 0.03)
  )
);
renderer.add(
  new Sphere(
    1,
    new Vec3(0, 1.4, -3),
    new Material(new Vec3(0.7, 0.2, 0.2), 0.03)
  )
);
renderer.add(
  new Sphere(
    1,
    new Vec3(0, 1.6, -3),
    new Material(new Vec3(0.7, 0.2, 0.2), 0.03)
  )
);
renderer.add(
  new Plane(
    new Vec3(0, 1, 0).norm(),
    new Vec3(),
    new Material(new Vec3(0.1, 0.1, 0.1), 0.03)
  )
);

renderBtn.addEventListener("click", () => {
  renderer.configure();
  renderer.render();
});
