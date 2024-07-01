import * as hullBlocks from "../../component/hullBlock.js";
import SelectionHandler from "./selectionHandler.js";
import * as tool from "./tool.js";

export default function hullTool(ecs, onCancel) {
  return tool.from("hull", new SelectionHandler(ecs, onCancel, paintHull));
}

export function paintHull(ecs, entity) {
  let p0 = entity.selection.p0;
  let p1 = entity.selection.p1;
  let [x0, x1] = p0.x < p1.x ? [p0.x, p1.x] : [p1.x, p0.x];
  let [y0, y1] = p0.y < p1.y ? [p0.y, p1.y] : [p1.y, p0.y];

  ecs.updateResource("tiles", (tiles) => {
    for (let x = x0; x <= x1; x++) {
      tiles[x] ||= [];
      for (let y = y0; y <= y1; y++) {
        if (tiles[x][y]) {
          continue;
        }

        ecs.newEntity(hullBlocks.newHullBlock(x, y));
        tiles[x][y] = true;
      }
    }
  });
}
