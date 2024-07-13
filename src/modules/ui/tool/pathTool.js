import * as tool from "./tool.js";
import { getTileCoordinates } from "../../util.js";
import pathfind from "./pathfind.js";

export default function pathTool(ecs, onCancel, onChange) {
  return tool.from("path tool", new Handler(ecs, onCancel, onChange));
}

class Handler {
  constructor(ecs, onCancel, onChange) {
    this.ecs = ecs;
    this.onCancel = onCancel;
    this.onChange = onChange;

    this.from = null;
    this.entity = null;
  }

  deactivate() {
    if (this.entity) {
      this.ecs.removeEntity(this.entity);
    }
  }

  mousedown(e) {
    if (e.button === 0) {
      let p = getTileCoordinates(e, this.ecs);
      this.from = p;
    } else if (e.button === 2) {
      if (this.entity) {
        this.ecs.removeEntity(this.entity);
      }
      this.onCancel();
    }
  }

  mousemove(e) {
    if (this.from === null) {
      return;
    }

    let p = getTileCoordinates(e, this.ecs);
    if (this.entity?.path[0] === p) {
      return;
    }

    let path = pathfind(
      this.#createPathMask(), // consider caching based on ecs.isDirty event hook?
      this.from.x,
      this.from.y,
      p.x,
      p.y,
    );
    this.onChange(e, path);
    if (path === null) {
      if (this.entity) {
        this.ecs.removeEntity(this.entity);
        this.entity = null;
      }
    } else {
      if (this.entity) {
        this.ecs.updateEntity(this.entity, (e) => (e.path = path));
      } else {
        this.entity = this.ecs.newEntity({ path });
      }
    }
  }

  mouseup(e) {
    if (this.entity !== null) {
      this.ecs.removeEntity(this.entity);
      this.entity = null;
    }
    this.onChange(e, null);
    this.from = null;
  }

  #createPathMask() {
    let tiles = this.ecs.getResource("tiles");
    let mask = [];
    for (let i in tiles) {
      mask[i] = tiles[i].slice();
    }

    this.ecs.entityQuery([], ["position", "module"], ({ position, module }) => {
      // TODO Need to add path metadata to modules. The "tiles" is more of a view.
      if (module.name.includes("Door")) {
        // "solid" tiles are pathable for doors.
        return;
      }

      let { x, y } = position;
      ["solid", "wall"]
        .filter((key) => module.tiles[key])
        .flatMap((key) => module.tiles[key])
        .forEach((rect) => {
          for (let i = x + rect.offsetX, maxi = i + rect.width; i < maxi; i++) {
            for (
              let j = y + rect.offsetY, maxj = j + rect.height;
              j < maxj;
              j++
            ) {
              mask[i] ||= [];
              mask[i][j] = false;
            }
          }
        });
    });

    return mask;
  }
}
