import { rem } from "./modules/css.js"
import { createEcs } from "./modules/ecs.js"
import { save, load, clearSaveData } from './modules/save.js'

import * as canvasUi from './modules/ui/canvas.js'
import * as editorUi from './modules/ui/editor.js'
import * as thingsHereUi from './modules/ui/thingsHere.js'

import { ClearCanvasSystem } from "./modules/systems/clearCanvasSystem.js"
import ModuleSystem from './modules/systems/moduleSystem.js'
import { GridRenderSystem } from "./modules/systems/gridRenderSystem.js"
import SelectionSystem from './modules/systems/selectionSystem.js'
import { TileRenderSystem } from "./modules/systems/tileRenderSystem.js"



function initializeTiles() {
  let tiles = []
  ecs.entityQuery([], ['position', 'tile'], ({position: {x, y}}) => {
    tiles[x] ||= []
    tiles[x][y] = true
  })
  return tiles
}

const canvas = document.querySelector("canvas")

const ecs = createEcs()
load(ecs)
ecs.newResource("canvas", canvas)
const cameraResource = ecs.newResource("camera", { offsetX: 0, offsetY: 0 })
const gridResource = ecs.newResource("grid", { s: rem(), w: 0, h: 0})
const tilesResource = ecs.newResource('tiles', initializeTiles())
ecs.registerSystems([
  ClearCanvasSystem,
  TileRenderSystem,
  GridRenderSystem,
  ModuleSystem,
  SelectionSystem
])


// N.B. these register event listeners.
let resources = { ecs }
canvasUi.install(resources)
thingsHereUi.install(resources)
editorUi.install(resources)

/* Register these after all other listeners to ensure save always reflects most
 * recent modification. */
canvas.addEventListener('mouseup', e => save(ecs))
document.querySelector('#btn-clear-all').addEventListener('click', e => clearSaveData(ecs))

canvasUi.refitCanvas(ecs)

let renderLoop = () => {
  if (ecs.isDirty) {
    ecs.run()
  }
  window.requestAnimationFrame(renderLoop)
}
renderLoop()

