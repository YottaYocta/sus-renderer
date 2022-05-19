import { Context } from "./context";
import { Vec3, Vec2, Ray, randInUnit } from "./utils";
import { Scene, Primitive, Sphere, IntersectionInfo } from "./renderable";

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

  #scene = new Scene();
  #light = new Vec3();
  #lightIntensity = 0;
  #lightRadius = 0;
  #worldColor = new Vec3();
  #maxBounces = 0;
  #samples = 0;
  #currentPixels = 0;
  #maxPixelsPerFrame = 0;

  #aspect = 1;
  #vh = 2;
  #vw = 2;
  #horizontal = new Vec3();
  #vertical = new Vec3();
  #lowerCorner = new Vec3();

  constructor(ctx: Context, camera: Camera) {
    this.#ctx = ctx;
    this.#camera = camera;
    this.renderLoop();
  }

  set samples(samples: number) {
    this.#samples = samples;
  }

  set light(sphere: Sphere) {
    this.#light = sphere.origin;
    this.#lightRadius = sphere.radius;
  }

  set lightIntensity(lightIntensity: number) {
    this.#lightIntensity = lightIntensity;
  }

  set worldColor(worldColor: Vec3) {
    this.#worldColor = worldColor;
  }

  set maxBounces(maxBounces: number) {
    this.#maxBounces = maxBounces;
  }

  configure() {
    this.#aspect = this.#ctx.width / this.#ctx.height;
    this.#vw = this.#vh * this.#aspect;
    this.#horizontal = new Vec3(this.#vw, 0, 0);
    this.#vertical = new Vec3(0, this.#vh, 0);
    this.#lowerCorner = this.#camera.position
      .sub(this.#horizontal.div(2))
      .sub(this.#vertical.div(2))
      .add(new Vec3(0, 0, this.#camera.focal));
  }

  add(primitive: Primitive) {
    this.#scene.add(primitive);
    this.render();
  }

  render() {
    this.configure();
    this.#ctx.clear();
    let start = new Date();
    for (let i = 0; i < this.#samples; i++)
      this.castPixel(
        Math.floor(this.#ctx.width / 2),
        Math.floor(this.#ctx.height / 2)
      );
    let end = new Date();
    this.#currentPixels = 0;
    this.#maxPixelsPerFrame =
      Math.max(
        1,
        Math.floor(16 / Math.max(1, end.getTime() - start.getTime()))
      ) * 10;
  }

  clear() {
    this.#scene.clear();
    this.render();
  }

  renderLoop() {
    if (this.#currentPixels <= this.#ctx.width * this.#ctx.height) {
      let count = 0;
      while (
        this.#currentPixels <= this.#ctx.width * this.#ctx.height &&
        count < this.#maxPixelsPerFrame
      ) {
        let y = Math.floor(this.#currentPixels / this.#ctx.width);
        let x = this.#currentPixels - y * this.#ctx.width;
        let total = new Vec3();
        for (let i = 0; i < this.#samples; i++) {
          total = total.add(this.castPixel(x, y).accumulator);
        }
        total = total.div(this.#samples);
        this.#ctx.setFlip(new Vec2(x, y), total);
        this.#currentPixels++;
        count++;
      }
    }

    window.requestAnimationFrame(() => {
      this.renderLoop();
    });
  }

  castPixel(x: number, y: number) {
    let ray = new Ray(
      this.#camera.position.clone(),
      this.#lowerCorner
        .add(
          this.#horizontal.mul(
            (x + (Math.random() * 2 - 1) / 2) / this.#ctx.width
          )
        )
        .add(
          this.#vertical.mul(
            (y + (Math.random() * 2 - 1) / 2) / this.#ctx.height
          )
        )
        .norm()
    );
    let info = {
      ray: ray,
      normal: new Vec3(),
      hitTime: -1,
      mask: new Vec3(1, 1, 1),
      accumulator: new Vec3(),
    };
    this.scatter(info, this.#maxBounces);
    this.#ctx.setFlip(new Vec2(x, y), info.accumulator);
    return info;
  }

  scatter(info: IntersectionInfo, bounces: number) {
    if (bounces <= 0) {
      info.accumulator = info.accumulator.add(new Vec3());
      return;
    }
    this.#scene.intersect(info);
    if (info.hitTime < 0) {
      let value = this.intersectWorld(info);
      info.accumulator = info.accumulator.add(info.mask.mul(value));
      return;
    }
    let value = this.intersectLight(info).add(this.intersectWorld(info));
    info.accumulator = info.accumulator.add(info.mask.mul(value));
    bounces--;
    this.scatter(info, bounces);
  }

  intersectWorld(info: IntersectionInfo) {
    let newInfo = {
      ray: info.ray.clone(),
      normal: info.normal.clone(),
      hitTime: -1,
      mask: info.mask.clone(),
      accumulator: info.accumulator.clone(),
    };
    this.#scene.intersect(newInfo);
    if (newInfo.hitTime >= 0) {
      return new Vec3();
    } else {
      return this.#worldColor.clone();
    }
  }

  intersectLight(info: IntersectionInfo) {
    let target = this.#light
      .add(randInUnit().mul(this.#lightRadius))
      .sub(info.ray.origin.clone())
      .norm();
    let ray = new Ray(info.ray.origin.clone(), target);
    let newInfo = {
      ray: ray,
      normal: info.normal.clone(),
      hitTime: -1,
      mask: info.mask.clone(),
      accumulator: info.accumulator.clone(),
    };
    this.#scene.intersect(newInfo);
    if (
      newInfo.hitTime >= 0 &&
      newInfo.ray.origin.dist(info.ray.origin) < info.ray.origin.dist(target)
    ) {
      return new Vec3();
    } else {
      let value = this.#lightIntensity / this.#light.dist(ray.origin);
      return new Vec3(value, value, value);
    }
  }
}
