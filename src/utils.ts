export class Vec2 {
  x: number;
  y: number;
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}

export function randInUnit() {
  let r = new Vec3();
  while (Math.sqrt(r.x * r.x + r.y + r.y + r.z + r.z) < 1) {
    r.x = Math.random() * 2 - 1;
    r.y = Math.random() * 2 - 1;
    r.z = Math.random() * 2 - 1;
  }
  return r;
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

  dist(a: Vec3) {
    let dx = this.x - a.x;
    let dy = this.y - a.y;
    let dz = this.z - a.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  get mag() {
    return Math.sqrt(this.dot(this));
  }

  norm() {
    let mag = this.mag;
    if (mag === 0) return new Vec3();
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

  at(time: number) {
    return this.origin.add(this.direction.mul(time));
  }

  clone() {
    return new Ray(this.origin.clone(), this.direction.clone());
  }
}
