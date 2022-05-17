import "./style.css";

import { Renderer, Camera } from "./renderer";
import { Context } from "./context";
import { Vec3 } from "./utils";
import { Sphere, Plane, Material } from "./renderable";

let renderBtn = document.getElementById("render-btn");
let canvasContainer = document.getElementById("canvas-container");
if (!renderBtn || !canvasContainer) throw "parent element do not exist";
let context = new Context(canvasContainer);
//context.resize(1500, 750);
//context.resize(400, 400);
//context.resize(80, 40);
context.resize(400, 200);
//context.resize(100, 100);
//context.resize(40, 40);
//context.resize(80, 40);
let camera = new Camera(new Vec3(0, 0.4, 2.5), 4);
let renderer = new Renderer(context, camera);
renderer.samples = 1;
renderer.light = new Sphere(3, new Vec3(5, 7, 3));
renderer.lightIntensity = 25;
renderer.worldColor = new Vec3();

SpawnMogus(0, -3, new Vec3(1, 0.1, 0), 10);
SpawnMogus(4, -4, new Vec3(1, 0.1, 1), 10);
SpawnMogus(-4, -4, new Vec3(1, 0.3, 0), 10);

function SpawnMogus(
  x: number,
  z: number,
  color: Vec3,
  resolution = 5,
  size = 1.3
) {
  let X = x;
  let Z = z;

  let legRadius = size / 2.3;
  let visorRadius = size / 3.6;

  // glass
  for (let i = 0; i <= resolution; i++) {
    renderer.add(
      new Sphere(
        visorRadius,
        new Vec3(
          X -
            visorRadius +
            ((2 * size - 2 * visorRadius) / (2.5 * resolution)) * i,
          size * 1.8,
          Z + size / 1.15 - Math.abs(resolution / 2 - i) / (resolution * 7)
        ),
        new Material(new Vec3(0.2, 0.2, 0.4).mul(1.5), 0)
      )
    );
  }

  // leg
  for (let i = 0; i < resolution; i++) {
    renderer.add(
      new Sphere(
        legRadius,
        new Vec3(
          X - size + legRadius,
          legRadius + i * (size / (2 * resolution)),
          Z
        ),
        new Material(color.clone(), 1)
      )
    );
  }
  for (let i = 0; i < resolution; i++) {
    renderer.add(
      new Sphere(
        legRadius,
        new Vec3(
          X + size - legRadius,
          legRadius + i * (size / (2 * resolution)),
          Z
        ),
        new Material(color.clone(), 1)
      )
    );
  }

  // body
  for (let i = 0; i < resolution; i++) {
    renderer.add(
      new Sphere(
        size + resolution / ((i + 1) * 500),
        new Vec3(X, 3 * legRadius + (i * legRadius) / 6, Z),
        new Material(color.clone(), 1)
      )
    );
  }
}

renderer.add(
  new Plane(
    new Vec3(0, -1, 0).norm(),
    new Vec3(0, 10, 0),
    new Material(new Vec3(0.1, 0.1, 0.1), 0)
  )
);
renderer.add(
  new Plane(
    new Vec3(0, 1, 0).norm(),
    new Vec3(),
    new Material(new Vec3(0.1, 0.1, 0.1), 0)
  )
);

renderBtn.addEventListener("click", () => {
  renderer.configure();
  renderer.render();
});
