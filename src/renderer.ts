import { Context } from "./context";
import { Vec3, Vec2, Ray } from "./utils";
import { Sphere } from "./primitives";

export class Camera {
  position: Vec3;
  focal: number;
  constructor(position = new Vec3(), focal = 1) {
    this.position = position;
    this.focal = focal;
  }
}

export class Renderer {
  #ctx: Context;
  #camera: Camera;

  #aspect = 1;
  #vh = 2;
  #vw = 2;
  #horizontal = new Vec3();
  #vertical = new Vec3();
  #lowerCorner = new Vec3();

  constructor(ctx: Context, camera: Camera) {
    this.#ctx = ctx;
    this.#camera = camera;
  }

  configure() {
    this.#aspect = this.#ctx.width / this.#ctx.height;
    this.#vw = this.#vh * this.#aspect;
    this.#horizontal = new Vec3(this.#vw, 0, 0);
    this.#vertical = new Vec3(0, this.#vh, 0);
    this.#lowerCorner = this.#camera.position
      .sub(this.#horizontal.div(2))
      .sub(this.#vertical.div(2))
      .sub(new Vec3(0, 0, this.#camera.focal));
  }

  renderSphere() {
    let sphere = new Sphere(1, new Vec3(0, 0, -2));
    for (let i = 0; i < this.#ctx.height; i++) {
      for (let j = 0; j < this.#ctx.width; j++) {
        let ray = new Ray(
          this.#camera.position.clone(),
          this.#lowerCorner
            .add(this.#horizontal.mul(j / this.#ctx.width))
            .add(this.#vertical.mul(i / this.#ctx.height))
            .norm()
        );
        let info = {
          ray: ray,
          normal: new Vec3(),
        };
        let result = sphere.intersect(info);
        if (result > 0) {
          this.#ctx.setFlip(new Vec2(j, i), info.normal.add(1).div(2));
        }
      }
    }
  }
}
