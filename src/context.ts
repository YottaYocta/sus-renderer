import { Vec2, Color } from "./utils";

export class Context {
  #parent: HTMLElement;
  #canvasElement: HTMLCanvasElement;
  #ctx: CanvasRenderingContext2D;

  constructor(parent: HTMLElement) {
    this.#parent = parent;
    this.#canvasElement = document.createElement("canvas");
    let ctx = this.#canvasElement.getContext("2d");
    if (ctx === null) throw "cannot create context";
    this.#ctx = ctx;
    parent.appendChild(this.#canvasElement);
  }

  clear() {
    this.#ctx.clearRect(
      0,
      0,
      this.#canvasElement.width,
      this.#canvasElement.height
    );
  }

  resize(width: number, height: number) {
    this.#canvasElement.width = width;
    this.#canvasElement.height = height;
  }

  get width() {
    return this.#canvasElement.width;
  }

  get height() {
    return this.#canvasElement.height;
  }

  set(location: Vec2, color: Color) {
    this.#ctx.fillStyle = `rgb(${color.x * 255}, ${color.y * 255}, ${
      color.z * 255
    })`;
    this.#ctx.fillRect(location.x, location.y, 1, 1);
  }

  setFlip(location: Vec2, color: Color) {
    this.#ctx.fillStyle = `rgb(${color.x * 255}, ${color.y * 255}, ${
      color.z * 255
    })`;
    this.#ctx.fillRect(
      location.x,
      this.#canvasElement.height - 1 - location.y,
      1,
      1
    );
  }

  destruct() {
    this.#parent.removeChild(this.#canvasElement);
  }
}
