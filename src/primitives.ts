import { Vec3, Ray } from "./utils";

export interface IntersectionInfo {
  ray: Ray;
  normal: Vec3;
  hitTime: number;
  mask: Vec3;
}

export interface Primitive {
  intersect: (info: IntersectionInfo) => void;
}

export class Scene implements Primitive {
  #objects: Primitive[] = [];
  add(object: Primitive) {
    this.#objects.push(object);
  }

  clear() {
    this.#objects.length = 0;
  }

  intersect(info: IntersectionInfo) {
    let originalInfo = {
      ray: info.ray.clone(),
      normal: info.normal.clone(),
      hitTime: -1,
      mask: info.mask.clone(),
    };
    for (let object of this.#objects) {
      let newInfo = {
        ray: originalInfo.ray.clone(),
        normal: originalInfo.normal.clone(),
        hitTime: -1,
        mask: originalInfo.mask.clone(),
      };
      object.intersect(newInfo);
      if (
        newInfo.hitTime > 0 &&
        (info.hitTime > newInfo.hitTime || info.hitTime === -1)
      ) {
        info.ray = newInfo.ray;
        info.normal = newInfo.normal;
        info.hitTime = newInfo.hitTime;
        info.mask = newInfo.mask;
      }
    }
  }
}

export class Sphere implements Primitive {
  readonly radius: number;
  readonly origin: Vec3;
  readonly color: Vec3;
  constructor(radius: number, origin: Vec3, color = new Vec3(1, 1, 1)) {
    this.radius = radius;
    this.origin = origin;
    this.color = color;
  }

  intersect(info: IntersectionInfo) {
    let originDiff = info.ray.origin.sub(this.origin);
    let a = info.ray.direction.dot(info.ray.direction);
    let b = originDiff.dot(info.ray.direction) * 2;
    let c = originDiff.dot(originDiff) - this.radius * this.radius;
    let determinant = b * b - 4 * a * c;
    if (determinant < 0) info.hitTime = -1;
    else {
      let t = (-b - Math.sqrt(determinant)) / (2 * a);
      info.normal = info.ray.origin.add(info.ray.at(t)).sub(this.origin).norm();
      info.hitTime = (-b - Math.sqrt(determinant)) / (2 * a);
      info.mask = info.mask.add(info.mask.mul(this.color));
    }
  }
}
