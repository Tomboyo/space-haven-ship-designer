import { rem } from "./modules/css.js"
import { createEcs } from "./modules/ecs.js"
import frameScheduler from "./modules/frameScheduler.js"
import { load } from './modules/save.js'

import StateMachine from './modules/input/state/stateMachine.js'

import canvasUi from './modules/input/ui/canvasUi.js'
import layoutPanelUi from './modules/input/ui/layoutPanelUi.js'
import paintPanelUi from './modules/input/ui/paintPanelUi.js'
import tabBarUi from './modules/input/ui/tabBarUi.js'
import thingsHereUi from './modules/input/ui/thingsHereUi.js'
import windowUi from './modules/input/ui/windowUi.js'

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

const ecs = createEcs()
load(ecs)
ecs.newResource("canvas", canvasUi.dom.canvas)
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

const stateMachine = new StateMachine(ecs, frameScheduler)

canvasUi.install(stateMachine, ecs)
layoutPanelUi.install(ecs, frameScheduler)
paintPanelUi.install(stateMachine, ecs)
tabBarUi.install()
thingsHereUi.install(ecs)
windowUi.install(stateMachine, ecs)

