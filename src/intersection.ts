import { Sphere } from "./primitives";
import { Vec3, Ray } from "./utils";

export interface IntersectionInfo {
  ray: Ray;
  normal: Vec3;
}

export function intersectSphere(info: IntersectionInfo, sphere: Sphere) {
  let originDiff = info.ray.origin.sub(sphere.origin);
  let a = info.ray.direction.dot(info.ray.direction);
  let b = originDiff.dot(info.ray.direction) * 2;
  let c = originDiff.dot(originDiff) - sphere.radius * sphere.radius;
  let determinant = b * b - 4 * a * c;
  if (determinant < 0) return -1;
  else {
    let t = (-b - Math.sqrt(determinant)) / (2 * a);
    info.normal = info.ray.origin
      .add(info.ray.direction.mul(t))
      .sub(sphere.origin);
    return (-b - Math.sqrt(determinant)) / (2 * a);
  }
}
