import "./style.css";

import { Renderer, Camera } from "./renderer";
import { Context } from "./context";
import { Vec3 } from "./utils";
import { Sphere, Plane, Material } from "./renderable";

let canvasContainer = document.getElementById("canvas-container");

let clearBtn = document.getElementById("clear-btn");

let sphereSelect = document.getElementById("sphere-select-btn");
let planeSelect = document.getElementById("plane-select-btn");
let amogusSelect = document.getElementById("amogus-select-btn");
let renderSelect = document.getElementById("render-select-btn");

let sphereForm = document.getElementById("sphere-form") as HTMLFormElement;
let planeForm = document.getElementById("plane-form") as HTMLFormElement;
let amogusForm = document.getElementById("amogus-form") as HTMLFormElement;
let renderForm = document.getElementById("render-form") as HTMLFormElement;
if (
  !clearBtn ||
  !canvasContainer ||
  !sphereForm ||
  !sphereSelect ||
  !planeSelect ||
  !planeForm ||
  !amogusSelect ||
  !amogusForm ||
  !renderSelect ||
  !renderForm
)
  throw "element error";

let context = new Context(canvasContainer);
let camera = new Camera(new Vec3(0, 0.5, -3), 4);
let renderer = new Renderer(context, camera);
let forms = [sphereForm, planeForm, amogusForm, renderForm];

function display(targetForm: HTMLFormElement) {
  for (let form of forms) {
    if (form === targetForm) {
      form.style.display = "block";
    } else {
      form.style.display = "none";
    }
  }
}

display(renderForm);

renderSelect.addEventListener("click", () => {
  display(renderForm);
});
sphereSelect.addEventListener("click", () => {
  display(sphereForm);
});
planeSelect.addEventListener("click", () => {
  display(planeForm);
});
amogusSelect.addEventListener("click", () => {
  display(amogusForm);
});

renderForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let data = new FormData(renderForm);
  let width = parseFloat(data.get("width") as string);
  let height = parseFloat(data.get("height") as string);
  let samples = parseFloat(data.get("samples") as string);
  let bounces = parseFloat(data.get("bounces") as string);
  let radius = parseFloat(data.get("radius") as string);
  let x = parseFloat(data.get("x") as string);
  let y = parseFloat(data.get("y") as string);
  let z = parseFloat(data.get("z") as string);
  let intensity = parseFloat(data.get("intensity") as string);
  let r = parseFloat(data.get("r") as string);
  let g = parseFloat(data.get("g") as string);
  let b = parseFloat(data.get("b") as string);
  let cx = parseFloat(data.get("cx") as string);
  let cy = parseFloat(data.get("cy") as string);
  let cz = parseFloat(data.get("cz") as string);
  let focal = parseFloat(data.get("focal") as string);
  context.resize(width, height);
  camera.position = new Vec3(cx, cy, cz);
  camera.focal = focal;
  console.log(camera);
  renderer.light = new Sphere(radius, new Vec3(x, y, z));
  renderer.lightIntensity = intensity;
  renderer.worldColor = new Vec3(r, g, b);
  renderer.maxBounces = bounces;
  renderer.samples = samples;
  renderer.configure();
  renderer.render();
});

sphereForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let data = new FormData(sphereForm);
  let x = parseFloat(data.get("x") as string);
  let y = parseFloat(data.get("y") as string);
  let z = parseFloat(data.get("z") as string);
  let radius = parseFloat(data.get("radius") as string);
  let r = parseFloat(data.get("r") as string);
  let g = parseFloat(data.get("g") as string);
  let b = parseFloat(data.get("b") as string);
  let roughness = parseFloat(data.get("roughness") as string);
  renderer.add(
    new Sphere(
      radius,
      new Vec3(x, y, z),
      new Material(new Vec3(r, g, b), roughness)
    )
  );
  sphereForm.reset();
});

planeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let data = new FormData(planeForm);
  let x = parseFloat(data.get("x") as string);
  let y = parseFloat(data.get("y") as string);
  let z = parseFloat(data.get("z") as string);
  let nx = parseFloat(data.get("nx") as string);
  let ny = parseFloat(data.get("ny") as string);
  let nz = parseFloat(data.get("nz") as string);
  let r = parseFloat(data.get("r") as string);
  let g = parseFloat(data.get("g") as string);
  let b = parseFloat(data.get("b") as string);
  let roughness = parseFloat(data.get("roughness") as string);
  console.log(r, g, b);
  renderer.add(
    new Plane(
      new Vec3(nx, ny, nz).norm(),
      new Vec3(x, y, z),
      new Material(new Vec3(r, g, b), roughness)
    )
  );
  planeForm.reset();
});

amogusForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let data = new FormData(amogusForm);
  let resolution = parseFloat(data.get("resolution") as string);
  let x = parseFloat(data.get("x") as string);
  let y = parseFloat(data.get("y") as string);
  let z = parseFloat(data.get("z") as string);
  let r = parseFloat(data.get("r") as string);
  let g = parseFloat(data.get("g") as string);
  let b = parseFloat(data.get("b") as string);
  SpawnMogus(new Vec3(x, y, z), new Vec3(r, g, b), resolution);
  amogusForm.reset();
});

function SpawnMogus(
  origin: Vec3,
  color: Vec3,
  resolution = 5,
  size = 1.3,
  direction = -1
) {
  let X = origin.x;
  let Z = origin.z;
  let Y = origin.y;

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
          size * 1.8 + Y,
          Z +
            direction *
              (size / 1.15 - Math.abs(resolution / 2 - i) / (resolution * 7))
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
          legRadius + i * (size / (2 * resolution)) + Y,
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
          legRadius + i * (size / (2 * resolution)) + Y,
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
        new Vec3(X, 3 * legRadius + (i * legRadius) / 6 + Y, Z),
        new Material(color.clone(), 1)
      )
    );
  }
}
renderer.add(
  new Plane(
    new Vec3(0, 1, 0).norm(),
    new Vec3(),
    new Material(new Vec3(0.05, 0.05, 0.05), 0)
  )
);

clearBtn.addEventListener("click", () => {
  renderer.clear();
});
