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
const tilesResource = ecs.newResource("tiles", JSON.parse(localStorage.getItem('tiles')) || [])
ecs.entities = JSON.parse(localStorage.getItem('entities')) || ecs.entities

ecs.registerSystems([
  ClearCanvasSystem,
  TileRenderSystem,
  GridRenderSystem,
  SelectionSystem
])

const inputManager = createInputManager(canvas, cameraResource, gridResource, tilesResource, frameScheduler, ecs)
window.addEventListener('resize', e => inputManager.onResize(e))
window.addEventListener('wheel', e => inputManager.onWheel(e))
canvas.addEventListener('mousedown', (e) => inputManager.onPointerDown(e))
canvas.addEventListener('mousemove', (e) => inputManager.onPointerMove(e))
canvas.addEventListener('mouseup', (e) => {
  inputManager.onPointerUp(e)
  save()
})
document.querySelector('#btn-draw-hull').addEventListener('click', (e) => inputManager.onPaintHullToggle(e))
document.querySelector('#btn-erase-hull').addEventListener('click', (e) => inputManager.onEraseHullToggle(e))

inputManager.onResize()

function save() {
  localStorage.setItem('tiles', JSON.stringify(tilesResource))
  localStorage.setItem('entities', JSON.stringify(ecs.entities))
}
