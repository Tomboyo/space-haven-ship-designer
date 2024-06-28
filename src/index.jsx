import ReactDOM from "react-dom/client";
import { rem } from "./modules/css.js";
import { createEcs } from "./modules/ecs.js";
import { save, load } from "./modules/save.js";

import * as canvasUi from "./modules/ui/canvas.js";
import EditingTools from "./modules/ui/EditingTools.jsx";
import UnderTheCursorTooltip from "./modules/ui/UnderTheCursorTooltip.jsx";

import layout from "./modules/ui/layouts.js";

import { ClearCanvasSystem } from "./modules/systems/clearCanvasSystem.js";
import ModuleSystem from "./modules/systems/moduleSystem.js";
import { GridRenderSystem } from "./modules/systems/gridRenderSystem.js";
import SelectionSystem from "./modules/systems/selectionSystem.js";
import { TileRenderSystem } from "./modules/systems/tileRenderSystem.js";

function initializeTiles() {
  let tiles = [];
  ecs.entityQuery([], ["position", "tile"], ({ position: { x, y } }) => {
    tiles[x] ||= [];
    tiles[x][y] = true;
  });
  return tiles;
}

const canvas = document.querySelector("canvas");

const ecs = createEcs();
load(ecs);
ecs.newResource("canvas", canvas);
ecs.newResource("camera", { offsetX: 0, offsetY: 0 });
ecs.newResource("grid", { s: rem(), w: 0, h: 0 });
ecs.newResource("tiles", initializeTiles());
ecs.registerSystems([
  ClearCanvasSystem,
  TileRenderSystem,
  GridRenderSystem,
  ModuleSystem,
  SelectionSystem,
]);

// N.B. these register event listeners.
let resources = { ecs };
canvasUi.install(resources);
ReactDOM.createRoot(document.querySelector("#react-app")).render(
  <>
    <EditingTools ecs={ecs} />,
    <UnderTheCursorTooltip ecs={ecs} />
  </>,
);

canvasUi.refitCanvas(ecs);

/* Temporary hack:
 * The editorUI loads the layout panel conditionally, and the layout panel has
 * a side-effect that sets the initial grid size. Eventually the grid size will
 * be decided in a root react component and passed down to the layout tab so it
 * can display the default grid size as the selected value when it loads. */
ecs.updateResource("grid", (grid) => {
  grid.w = layout[0].width;
  grid.h = layout[0].height;
});

let renderLoop = () => {
  if (ecs.needsToRun) {
    ecs.run();
  }
  if (ecs.isSaveDataModified) {
    save(ecs.getSaveData());
  }
  window.requestAnimationFrame(renderLoop);
};
ecs.run();
renderLoop();
