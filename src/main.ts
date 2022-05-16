import "./style.css";

import { Renderer, Camera } from "./renderer";
import { Context } from "./context";
import { Vec3 } from "./utils";
import { Sphere, Material } from "./renderable";

let renderBtn = document.getElementById("render-btn");
let canvasContainer = document.getElementById("canvas-container");
if (!renderBtn || !canvasContainer) throw "parent element do not exist";
let context = new Context(canvasContainer);
//context.resize(1000, 1000);
//context.resize(400, 400);
//context.resize(100, 100);
//context.resize(40, 40);
let camera = new Camera(new Vec3(0, 0.5, 0), 1);
let renderer = new Renderer(context, camera);
renderer.samples = 100;
renderer.light = new Sphere(3, new Vec3(3, 7, 0));
renderer.lightIntensity = 30;
renderer.worldColor = new Vec3();
let gloss = 1;
renderer.add(
  new Sphere(
    1,
    new Vec3(2.2, 1, -4.2),
    new Material(new Vec3(0.1, 0.1, 0.1), gloss)
  )
);
renderer.add(
  new Sphere(
    1.4,
    new Vec3(0, 1.4, -4),
    new Material(new Vec3(0.45, 0.3, 0.2), gloss)
  )
);
renderer.add(
  new Sphere(
    1,
    new Vec3(-2.2, 1, -4.2),
    new Material(new Vec3(0.2, 0.2, 0.25), gloss)
  )
);
renderer.add(
  new Sphere(
    1000,
    new Vec3(0, -1000, -5),
    new Material(new Vec3(0.1, 0.1, 0.1), gloss)
  )
);

renderBtn.addEventListener("click", () => {
  renderer.configure();
  renderer.render();
});
