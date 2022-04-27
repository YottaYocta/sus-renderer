import { Vec3, Ray } from './utils';

export interface IntersectionInfo {
  ray: Ray,
  normal: Vec3;
}
export class Sphere {
  readonly radius: number;
  readonly origin: Vec3;
  constructor(radius: number, origin: Vec3) {
    this.radius = radius;
    this.origin = origin;
  }

  intersect(info: IntersectionInfo) {
    let originDiff = info.ray.origin.sub(this.origin);
    let a = info.ray.direction.dot(info.ray.direction);
    let b = originDiff.dot(info.ray.direction) * 2
    let c = originDiff.dot(originDiff) - this.radius * this.radius;
    let determinant = b * b - 4 * a * c;
    if (determinant < 0)
      return -1;
    else {
      let t = (-b - Math.sqrt(determinant)) / (2 * a);
      info.normal = info.ray.origin.add(info.ray.direction.mul(t)).sub(this.origin);
      return (-b - Math.sqrt(determinant)) / (2 * a);
    }
  }
}

