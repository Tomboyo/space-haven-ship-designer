import { newModule } from "../../component/module.js";
import { getTileCoordinates } from "../../util.js";

import Brush from "./brush.js";

export default function paintModuleBrush(ecs, module, onCancel) {
  return new Brush({
    deactivate() {
      if (this.entity) {
        ecs.removeEntity(this.entity);
        this.entity = null;
      }
    },

    mousedown(e) {
      if (e.button === 0) {
        let p = getTileCoordinates(e, ecs);
        ecs.newEntity(newModule(module, false, p, this.rotation));
      } else if (e.button === 2) {
        if (this.entity) {
          ecs.removeEntity(this.entity);
          this.entity = null;
        }
        onCancel();
      }
    },

    mousemove(e) {
      let p = getTileCoordinates(e, ecs);
      if (!this.entity) {
        /* Create ghost when the cursor enters the canvas */
        this.rotation = 0;
        this.entity = ecs.newEntity(newModule(module, true, p, this.rotation));
      } else {
        ecs.updateEntity(this.entity, (it) => (it.position = p));
      }
    },

    keydown(e) {
      if (e.key === "e" && this.entity) {
        // clockwise
        this.rotation = (this.rotation + 1) % 4;
        ecs.removeEntity(this.entity);
        this.entity = ecs.newEntity(
          newModule(module, true, this.entity.position, this.rotation),
        );
      } else if (e.key === "q" && this.entity) {
        // anticlockwise
        this.rotation = this.rotation - 1;
        if (this.rotation < 0) {
          this.rotation += 4;
        }

        ecs.removeEntity(this.entity);
        this.entity = ecs.newEntity(
          newModule(module, true, this.entity.position, this.rotation),
        );
      }
    },
  });
}
