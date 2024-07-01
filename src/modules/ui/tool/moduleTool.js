import { newModule } from "../../component/module.js";
import { getTileCoordinates } from "../../util.js";
import * as tool from "./tool.js";
import { paintHull } from "./hullTool.js";

export default function moduleTool(ecs, module, onCancel) {
  return tool.from(`module ${module.name}`, new Handler(ecs, module, onCancel));
}

class Handler {
  constructor(ecs, module, onCancel) {
    this.ecs = ecs;
    this.module = module;
    this.onCancel = onCancel;
  }

  deactivate() {
    if (this.entity) {
      this.ecs.removeEntity(this.entity);
      this.entity = null;
    }
  }

  mousedown(e) {
    if (e.button === 0) {
      let p = getTileCoordinates(e, this.ecs);
      let m = newModule(this.module, false, p, this.rotation);
      this.ecs.newEntity(m);
      ["empty", "striped"]
        .filter((key) => m.module.tiles[key])
        .forEach((key) =>
          m.module.tiles[key].forEach(({ width, height, offsetX, offsetY }) =>
            paintHull(this.ecs, {
              selection: {
                p0: {
                  x: p.x + offsetX,
                  y: p.y + offsetY,
                },
                p1: {
                  x: p.x + offsetX + width - 1,
                  y: p.y + offsetY + height - 1,
                },
              },
            }),
          ),
        );
    } else if (e.button === 2) {
      if (this.entity) {
        this.ecs.removeEntity(this.entity);
        this.entity = null;
      }
      this.onCancel();
    }
  }

  mousemove(e) {
    let p = getTileCoordinates(e, this.ecs);
    if (!this.entity) {
      /* Create ghost when the cursor enters the canvas */
      this.rotation = 0;
      this.entity = this.ecs.newEntity(
        newModule(this.module, true, p, this.rotation),
      );
    } else {
      this.ecs.updateEntity(this.entity, (it) => (it.position = p));
    }
  }

  keydown(e) {
    if (e.key === "e" && this.entity) {
      // clockwise
      this.rotation = (this.rotation + 1) % 4;
      this.ecs.removeEntity(this.entity);
      this.entity = this.ecs.newEntity(
        newModule(this.module, true, this.entity.position, this.rotation),
      );
    } else if (e.key === "q" && this.entity) {
      // anticlockwise
      this.rotation = this.rotation - 1;
      if (this.rotation < 0) {
        this.rotation += 4;
      }

      this.ecs.removeEntity(this.entity);
      this.entity = this.ecs.newEntity(
        newModule(this.module, true, this.entity.position, this.rotation),
      );
    }
  }
}
