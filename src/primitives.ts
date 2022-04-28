import { Vec3 } from "./utils";

export class Sphere {
  readonly radius: number;
  readonly origin: Vec3;
  constructor(radius: number, origin: Vec3) {
    this.radius = radius;
    this.origin = origin;
  }
}
