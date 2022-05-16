import { Vec3, Ray, randInUnit } from "./utils";

export interface IntersectionInfo {
  ray: Ray;
  normal: Vec3;
  hitTime: number;
  mask: Vec3;
  accumulator: Vec3;
}

export interface Primitive {
  intersect: (info: IntersectionInfo) => void;
}

export class Material {
  readonly smoothness: number;
  readonly color: Vec3;
  constructor(color = new Vec3(1, 1, 1), smoothness = 0) {
    this.smoothness = smoothness;
    this.color = color;
  }
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
    let originalInfo: IntersectionInfo = {
      ray: info.ray.clone(),
      normal: info.normal.clone(),
      hitTime: -1,
      mask: info.mask.clone(),
      accumulator: info.accumulator.clone(),
    };
    let hit = false;
    for (let object of this.#objects) {
      let newInfo = {
        ray: originalInfo.ray.clone(),
        normal: originalInfo.normal.clone(),
        hitTime: -1,
        mask: originalInfo.mask.clone(),
        accumulator: originalInfo.accumulator.clone(),
      };
      object.intersect(newInfo);
      if (
        newInfo.hitTime > 0 &&
        (info.hitTime > newInfo.hitTime || info.hitTime < 0)
      ) {
        hit = true;
        info.ray = newInfo.ray;
        info.normal = newInfo.normal;
        info.hitTime = newInfo.hitTime;
        info.mask = newInfo.mask;
      }
    }
    if (!hit) {
      info.hitTime = -1;
    }
  }
}

export class Sphere implements Primitive {
  readonly radius: number;
  readonly origin: Vec3;
  readonly material: Material;
  constructor(radius: number, origin: Vec3, material = new Material()) {
    this.radius = radius;
    this.origin = origin;
    this.material = material;
  }

  intersect(info: IntersectionInfo) {
    let originDiff = info.ray.origin.sub(this.origin);
    let a = info.ray.direction.dot(info.ray.direction);
    let b = originDiff.dot(info.ray.direction) * 2;
    let c = originDiff.dot(originDiff) - this.radius * this.radius;
    let determinant = b * b - 4 * a * c;
    if (determinant < 0) {
      info.hitTime = -1;
    } else {
      let t = (-b - Math.sqrt(determinant)) / (2 * a);
      info.normal = info.ray.origin.add(info.ray.at(t)).sub(this.origin).norm();
      info.hitTime = t;
      info.mask = info.mask.mul(this.material.color);
      info.ray.origin = info.ray.at(info.hitTime).add(info.normal.div(1000));
      if (Math.random() < this.material.smoothness) {
        let rand = randInUnit().norm();
        info.ray.direction = info.normal.add(rand);
      } else {
        info.ray.direction = info.normal;
      }
    }
  }
}

export class Plane implements Primitive {
  readonly normal: Vec3;
  readonly origin: Vec3;
  readonly material: Material;
  constructor(normal: Vec3, origin: Vec3, material = new Material()) {
    this.normal = normal;
    this.origin = origin;
    this.material = material;
  }

  intersect(info: IntersectionInfo) {
    let diffOrigin = this.origin.sub(info.ray.origin).dot(this.normal);
    let d = info.ray.direction.dot(this.normal);
    if (Math.abs(d) < 0.0001) {
      info.hitTime = -1;
    } else {
      let t = diffOrigin / d;
      info.normal = this.normal.clone();
      info.hitTime = t;
      info.mask = info.mask.mul(this.material.color);
      info.ray.origin = info.ray.at(info.hitTime).add(info.normal.div(1000));
      if (Math.random() < this.material.smoothness) {
        let rand = randInUnit().norm();
        info.ray.direction = info.normal.add(rand);
      } else {
        info.ray.direction = info.normal;
      }
      //console.log(info.normal, info.ray.origin);
    }
  }
}
