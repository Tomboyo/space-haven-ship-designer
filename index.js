import { createEcs } from "./modules/ecs.js"
import { createInputManager } from './modules/input.js'
import frameScheduler from "./modules/frameScheduler.js"
import { rem } from "./modules/css.js"
import { ClearCanvasSystem } from "./modules/systems/clearCanvasSystem.js"
import { GridRenderSystem } from "./modules/systems/gridRenderSystem.js"
import SelectionSystem from './modules/systems/selectionSystem.js'
import { TileRenderSystem } from "./modules/systems/tileRenderSystem.js" 

const canvas = document.querySelector("canvas")
const ecs = createEcs()

ecs.newResource("canvas", canvas)
const cameraResource = ecs.newResource("camera", { offsetX: 0, offsetY: 0 })
const gridResource = ecs.newResource("grid", { s: rem() })
const tilesResource = ecs.newResource("tiles", [])

ecs.registerSystems([
  ClearCanvasSystem,
  TileRenderSystem,
  GridRenderSystem,
  SelectionSystem
])

const inputManager = createInputManager(canvas, cameraResource, gridResource, tilesResource, frameScheduler, ecs)
window.addEventListener('resize', e => inputManager.onResize(e))
window.addEventListener('wheel', e => inputManager.onWheel(e))
canvas.addEventListener('pointerdown', (e) => inputManager.onPointerDown(e))
canvas.addEventListener('pointermove', (e) => inputManager.onPointerMove(e))
canvas.addEventListener('pointerup', (e) => inputManager.onPointerUp(e))
document.querySelector('#btn-draw-hull').addEventListener('click', (e) => inputManager.onPaintHullToggle(e))

inputManager.onResize()

