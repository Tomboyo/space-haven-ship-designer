import { rem } from "./modules/css.js"
import { createEcs } from "./modules/ecs.js"
import frameScheduler from "./modules/frameScheduler.js"
import { InputManager } from './modules/input.js'
import { save, load, clearSaveData } from './modules/save.js'

import { ModulesCarousel } from './modules/input/moduleCarousel.js'

import { modules } from './modules/component/modules.js'

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
const gridResource = ecs.newResource("grid", { s: rem() })
const tilesResource = ecs.newResource('tiles', initializeTiles())
ecs.registerSystems([
  ClearCanvasSystem,
  TileRenderSystem,
  GridRenderSystem,
  ModuleSystem,
  SelectionSystem
])

// N.B. these registered event listeners.
const inputManager = new InputManager(ecs, frameScheduler)
const modulesCarousel = new ModulesCarousel(inputManager)

/* Register these after all other listeners to ensure save always reflects most
 * recent modification. */
canvas.addEventListener('mouseup', e => save(ecs))
document.querySelector('#btn-clear-all').addEventListener('click', e => clearSaveData(ecs))

inputManager.onResize()

