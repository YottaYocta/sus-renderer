import "./style.css";

import { Renderer, Camera } from "./renderer";
import { Context } from "./context";
import { Vec3 } from "./utils";
import { Sphere, Plane, Material } from "./renderable";

let canvasContainer = document.getElementById("canvas-container");

let renderBtn = document.getElementById("render-btn");
let clearBtn = document.getElementById("clear-btn");

let sphereSelect = document.getElementById("sphere-select-btn");
let planeSelect = document.getElementById("plane-select-btn");
let amogusSelect = document.getElementById("amogus-select-btn");

let sphereForm = document.getElementById("sphere-form") as HTMLFormElement;
let planeForm = document.getElementById("plane-form") as HTMLFormElement;
let amogusForm = document.getElementById("amogus-form") as HTMLFormElement;
if (
  !renderBtn ||
  !clearBtn ||
  !canvasContainer ||
  !sphereForm ||
  !sphereSelect ||
  !planeSelect ||
  !planeForm ||
  !amogusSelect ||
  !amogusForm
)
  throw "element error";

let context = new Context(canvasContainer);
context.resize(400, 200);

let camera = new Camera(new Vec3(0, 0.5, -3), 4);
let renderer = new Renderer(context, camera);
renderer.samples = 10;
renderer.light = new Sphere(3, new Vec3(5, 7, 3).div(2));
renderer.lightIntensity = 100;
renderer.worldColor = new Vec3();

function display(index: number) {
  if (index === 0) {
    sphereForm.style.display = "block";
    planeForm.style.display = "none";
    amogusForm.style.display = "none";
  } else if (index === 1) {
    sphereForm.style.display = "none";
    planeForm.style.display = "block";
    amogusForm.style.display = "none";
  } else {
    sphereForm.style.display = "none";
    planeForm.style.display = "none";
    amogusForm.style.display = "block";
  }
}

display(0);

sphereSelect.addEventListener("click", () => {
  display(0);
});
planeSelect.addEventListener("click", () => {
  display(1);
});
amogusSelect.addEventListener("click", () => {
  display(2);
});

sphereForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let data = new FormData(sphereForm);
  let x = parseInt(data.get("x") as string);
  let y = parseInt(data.get("y") as string);
  let z = parseInt(data.get("z") as string);
  let r = parseInt(data.get("r") as string);
  let g = parseInt(data.get("g") as string);
  let b = parseInt(data.get("b") as string);
  renderer.add(
    new Sphere(1, new Vec3(x, y, z), new Material(new Vec3(r, g, b), 0))
  );
  sphereForm.reset();
});

planeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let data = new FormData(planeForm);
  let x = parseInt(data.get("x") as string);
  let y = parseInt(data.get("y") as string);
  let z = parseInt(data.get("z") as string);
  let nx = parseInt(data.get("nx") as string);
  let ny = parseInt(data.get("ny") as string);
  let nz = parseInt(data.get("nz") as string);
  let r = parseInt(data.get("r") as string);
  let g = parseInt(data.get("g") as string);
  let b = parseInt(data.get("b") as string);
  console.log(nx, ny, nz);
  renderer.add(
    new Plane(
      new Vec3(nx, ny, nz).norm(),
      new Vec3(x, y, z),
      new Material(new Vec3(r, g, b), 0)
    )
  );
  planeForm.reset();
});

amogusForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let data = new FormData(amogusForm);
  let x = parseInt(data.get("x") as string);
  let y = parseInt(data.get("y") as string);
  let z = parseInt(data.get("z") as string);
  let r = parseInt(data.get("r") as string);
  let g = parseInt(data.get("g") as string);
  let b = parseInt(data.get("b") as string);
  SpawnMogus(new Vec3(x, y, z), new Vec3(r, g, b));
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

renderBtn.addEventListener("click", () => {
  renderer.configure();
  renderer.render();
});

clearBtn.addEventListener("click", () => {
  renderer.clear();
});
