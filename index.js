import { createEcs } from "./modules/ecs.js"
import { InputManager } from './modules/input.js'
import frameScheduler from "./modules/frameScheduler.js"
import { rem } from "./modules/css.js"
import { ClearCanvasSystem } from "./modules/systems/clearCanvasSystem.js"
import ModuleSystem from './modules/systems/moduleSystem.js'
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
  ModuleSystem,
  SelectionSystem
])

const inputManager = new InputManager(ecs, frameScheduler)
window.addEventListener('resize', e => inputManager.onResize(e))
window.addEventListener('wheel', e => inputManager.onWheel(e))
canvas.addEventListener('mousedown', (e) => inputManager.onCanvasMouseDown(e))
canvas.addEventListener('mousemove', (e) => inputManager.onCanvasMouseMove(e))
canvas.addEventListener('mouseup', (e) => {
  inputManager.onCanvasMouseUp(e)
  save()
})
document.querySelector('#btn-draw-hull').addEventListener('click', (e) => inputManager.onPaintHullToggleClick(e))
document.querySelector('#btn-erase-hull').addEventListener('click', (e) => inputManager.onEraseHullToggleClick(e))
document.querySelector('#btn-draw-module').addEventListener('click', (e) => inputManager.onPaintModuleToggleClick(e))

inputManager.onResize()

function save() {
  localStorage.setItem('tiles', JSON.stringify(tilesResource))
  localStorage.setItem('entities', JSON.stringify(ecs.entities))
}
