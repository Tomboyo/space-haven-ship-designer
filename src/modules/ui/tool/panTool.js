import * as tool from "./tool.js";

export default function panTool(ecs) {
  return tool.from("pan", new Handler(ecs));
}

class Handler {
  constructor(ecs) {
    this.ecs = ecs;
  }

  mousedown(e) {
    if (e.button === 0) {
      this.drag = true;
    }
  }

  mouseup(e) {
    if (e.button === 0) {
      this.drag = false;
    }
  }

  mousemove(e) {
    if (this.drag) {
      this.ecs.updateResource("camera", (c) => {
        c.offsetX += e.movementX;
        c.offsetY += e.movementY;
      });
    }
  }
}
