export class Vec2 {
  x: number;
  y: number;
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}

export type Color = Vec3;
export class Vec3 {
  x: number;
  y: number;
  z: number;

  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  add(a: Vec3 | number) {
    if (typeof a === "number")
      return new Vec3(this.x + a, this.y + a, this.z + a);
    else return new Vec3(this.x + a.x, this.y + a.y, this.z + a.z);
  }

  sub(a: Vec3 | number) {
    if (typeof a === "number")
      return new Vec3(this.x - a, this.y - a, this.z - a);
    else return new Vec3(this.x - a.x, this.y - a.y, this.z - a.z);
  }

  mul(a: Vec3 | number) {
    if (typeof a === "number")
      return new Vec3(this.x * a, this.y * a, this.z * a);
    else return new Vec3(this.x * a.x, this.y * a.y, this.z * a.z);
  }

  div(a: Vec3 | number) {
    if (typeof a === "number")
      return new Vec3(this.x / a, this.y / a, this.z / a);
    else return new Vec3(this.x / a.x, this.y / a.y, this.z / a.z);
  }

  dot(a: Vec3) {
    return this.x * a.x + this.y * a.y + this.z * a.z;
  }

  get mag() {
    return Math.sqrt(this.dot(this));
  }

  norm() {
    let mag = this.mag;
    return new Vec3(this.x / mag, this.y / mag, this.z / mag);
  }

  clone() {
    return new Vec3(this.x, this.y, this.z);
  }
}

export class Ray {
  origin: Vec3;
  direction: Vec3;
  constructor(origin: Vec3, direction: Vec3) {
    this.origin = origin;
    this.direction = direction;
  }

  clone() {
    return new Ray(this.origin.clone(), this.direction.clone());
  }
}
