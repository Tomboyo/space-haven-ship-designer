import ReactDOM from "react-dom/client";
import { rem } from "./modules/css.js";
import { createEcs } from "./modules/ecs.js";
import { save, load } from "./modules/save.js";

import * as canvasUi from "./modules/ui/canvas.js";
import App from "./App.jsx";

import { ClearCanvasSystem } from "./modules/systems/clearCanvasSystem.js";
import ModuleSystem from "./modules/systems/moduleSystem.js";
import { GridRenderSystem } from "./modules/systems/gridRenderSystem.js";
import SelectionSystem from "./modules/systems/selectionSystem.js";
import { TileRenderSystem } from "./modules/systems/tileRenderSystem.js";
import PathRenderSystem from "./modules/systems/pathRenderSystem.js";

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
  PathRenderSystem,
  SelectionSystem,
]);

// N.B. these register event listeners.
let resources = { ecs };
canvasUi.install(resources);
ReactDOM.createRoot(document.querySelector("#react-app")).render(
  <App ecs={ecs} />,
);

canvasUi.refitCanvas(ecs);

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
