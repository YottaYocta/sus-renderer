import { Vec3, Vec2, Ray } from './utils';
import { Context } from './context';
import { Sphere } from './primitives';

window.addEventListener('keydown', () => {
  initialize();
  gradientTest();
  renderSphere();
});

const aspect = 16/9;
const imageWidth = 1000;
const imageHeight = imageWidth / aspect;
let ctx: Context;

function initialize() {
  if (ctx)
    ctx.destruct();

  ctx = new Context(document.body);    
  ctx.resize(imageWidth, imageHeight);
}

function gradientTest() {
  let vh = 2;
  let vw = vh * aspect;

  let focal = 1;
  let origin = new Vec3();

  let width = new Vec3(vw, 0, 0);
  let height = new Vec3(0, vh, 0);
  let lowerCorner = origin
    .sub(width.div(2))
    .sub(height.div(2))
    .sub(new Vec3(0, 0, focal));

  for (let i = 0; i < imageHeight; i++) {
    for (let j = 0; j < imageWidth; j++) {
      let ray = new Ray(origin, 
          lowerCorner
            .add(width.mul(j / imageWidth))
            .add(height.mul(i / imageHeight))
            .norm()
      );
      let t = 0.5 * (ray.direction.y + 1);
      ctx.setFlip(new Vec2(j, i),
          new Vec3(1, 1, 1).mul(1 - t).add(
            new Vec3(0.5, 0.7, 1.0).mul(t)
        )
      )
    }
  }
}

function renderSphere() {
  let vh = 2;
  let vw = vh * aspect;

  let focal = 1;
  let origin = new Vec3();

  let width = new Vec3(vw, 0, 0);
  let height = new Vec3(0, vh, 0);

  let sphere = new Sphere(1, new Vec3(0, 0,  -2));
  let lowerCorner = origin
    .sub(width.div(2))
    .sub(height.div(2))
    .sub(new Vec3(0, 0, focal));
  for (let i = 0; i < imageHeight; i++) {
    for (let j = 0; j < imageWidth; j++) {
      let ray = new Ray(origin, 
        lowerCorner
          .add(width.mul(j / imageWidth))
          .add(height.mul(i / imageHeight))
          .norm()
      );
      let info = {
        ray: ray,
        normal: new Vec3()
      }
      let result = sphere.intersect(info);
      if (result > 0) {
        ctx.setFlip(new Vec2(j, i),
          info.normal.add(1).div(2)
        )
      }
    }
  }
}
