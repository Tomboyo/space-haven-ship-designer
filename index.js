import { createEcs } from "./modules/ecs.js"
import { ClearCanvasSystem } from "./modules/systems/clearCanvasSystem.js"
import { GridRenderSystem } from "./modules/systems/gridRenderSystem.js"
import { TileRenderSystem } from "./modules/systems/tileRenderSystem.js" 

const canvas = document.querySelector("canvas")
const rem = () => parseInt(window.getComputedStyle(document.documentElement).fontSize)
const ecs = createEcs()

ecs.newResource("canvas", canvas)
const cameraResource = ecs.newResource("camera", { offsetX: 0, offsetY: 0 })
const gridResource = ecs.newResource("grid", { s: rem() })
const tilesResource = ecs.newResource("tiles", [])

ecs.registerSystems([
  ClearCanvasSystem,
  TileRenderSystem,
  GridRenderSystem
])

const PointerMode = {
  DrawHull: 'draw hull',
  Pan: 'pan'
}

var pointerMode = PointerMode.Pan;

const resizeCanvas = () => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  ecs.run()
}

window.addEventListener('resize', resizeCanvas)

const zoom = (e) => {
  gridResource.s += rem() * e.deltaY * -0.00075
  ecs.run()
}

window.addEventListener('wheel', zoom)

const newHullBlock = (x, y) => {
  return {
    "position": { x, y },
    "tile": { color: "gray" }
  }
}

const mouseMove = (e) => {
  if (e.buttons != 1) return

  if (pointerMode == PointerMode.Pan) {
    cameraResource.offsetX += e.movementX
    cameraResource.offsetY += e.movementY
  } else {
    let x = Math.floor((e.offsetX - cameraResource.offsetX) / gridResource.s)
    let y = Math.floor((e.offsetY - cameraResource.offsetY) / gridResource.s)
    tilesResource[x] ||= []
    if (!tilesResource[x][y]) {
      tilesResource[x][y] = ecs.newEntity(newHullBlock(x, y));
    }
  }

  ecs.run()
}

window.addEventListener('pointermove', mouseMove)


const toggleDrawHull = (e) => {
  if (pointerMode == PointerMode.DrawHull) {
    pointerMode = PointerMode.Pan
    e.target.classList.remove('active')
  } else {
    pointerMode = PointerMode.DrawHull
    e.target.classList.add('active')
  }
}

document.querySelector('#btn-draw-hull').addEventListener('click', toggleDrawHull)

resizeCanvas()

