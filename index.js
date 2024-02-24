import { createEcs } from "./modules/ecs.js"
import { InputManager } from './modules/input.js'
import frameScheduler from "./modules/frameScheduler.js"
import { rem } from "./modules/css.js"
import { ClearCanvasSystem } from "./modules/systems/clearCanvasSystem.js"
import ModuleSystem from './modules/systems/moduleSystem.js'
import { GridRenderSystem } from "./modules/systems/gridRenderSystem.js"
import SelectionSystem from './modules/systems/selectionSystem.js'
import { TileRenderSystem } from "./modules/systems/tileRenderSystem.js"
import { modules } from './modules/component/modules.js'

loadModules()

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
canvas.addEventListener('wheel', e => inputManager.onCanvasWheel(e))
canvas.addEventListener('mousedown', (e) => inputManager.onCanvasMouseDown(e))
canvas.addEventListener('mousemove', (e) => inputManager.onCanvasMouseMove(e))
canvas.addEventListener('mouseup', (e) => {
  inputManager.onCanvasMouseUp(e)
  save()
})
document.querySelector('#btn-paint-hull').addEventListener('click', (e) => inputManager.onPaintHullToggleClick(e))
document.querySelector('#btn-erase').addEventListener('click', (e) => inputManager.onEraseHullToggleClick(e))
document.querySelector('#btn-clear-all').addEventListener('click', (d) => {
  if (confirm('This will delete you ship and saved data. Are you sure?')) {
    clearSaveData()
  }
})

inputManager.onResize()

function save() {
  localStorage.setItem('tiles', JSON.stringify(tilesResource))
  localStorage.setItem('entities', JSON.stringify(ecs.entities))
}

function clearSaveData() {
  localStorage.removeItem('tiles')
  localStorage.removeItem('entities')
  ecs.removeAllEntities()
  ecs.updateResource('tiles', tiles => tiles.splice(0))
  ecs.run()
}

function loadModules() {
  let select = document.querySelector('#select-module-kind')
  let modulesList = document.querySelector('#modules-list')
  Object.keys(modules).forEach(category => {
    let option = document.createElement('option')
    option.value = category
    option.innerHTML = category
    select.appendChild(option)

    Object.keys(modules[category]).forEach(name => {
      let button = document.createElement('button')
      button.innerHTML = name
      button.addEventListener('click', (e) => inputManager.onPaintModuleToggleClick(e, { category, name }))
      modulesList.appendChild(button)
    })
  })
}
