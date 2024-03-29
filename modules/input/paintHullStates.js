import { styleButtonActive, styleButtonInactive } from '../css.js'
import { getTileCoordinates } from '../util.js'
import { newHullBlock } from '../component/hullBlock.js'

import { PanState } from './panState.js'
import { EraseHullInitialState } from './eraseHullStates.js'
import { PaintModuleInitialState } from './paintModuleStates.js'

export class PaintHullInitialState {
  constructor (manager) {
    this.manager = manager
  }

  onPaintHullToggleClick() {
    styleButtonInactive(this.manager.ui.paintHullToggle)
    return new PanState(this.manager)
  }

  onEraseHullToggleClick() {
    styleButtonActive(this.manager.ui.eraseHullToggle)
    styleButtonInactive(this.manager.ui.paintHullToggle)
    return new EraseHullInitialState(this.manager)
  }

  onPaintModuleToggleClick(e, module) {
    styleButtonInactive(this.manager.ui.paintHullToggle)
    styleButtonActive(e.target)
    return new PaintModuleInitialState(this.manager, e, module)
  }

  onCanvasLeftMouseDown(e) {
    let p = getTileCoordinates(e, this.manager.ecs)
    let entity = this.manager.ecs.newEntity({ 'selection': {p0: p, p1: p}})
    return new PaintHullSelectingState(this.manager, entity)
  }

  onCanvasRightMouseDown(e) {
    styleButtonInactive(this.manager.ui.paintHullToggle)
    return new PanState(this.manager)
  }
}

class PaintHullSelectingState {
  constructor(manager, entity) {
    this.manager = manager
    this.entity = entity
  }

  onCanvasMouseMove(e) {
    this.manager.ecs.updateEntity(this.entity, entity => 
        entity.selection.p1 = getTileCoordinates(e, this.manager.ecs))
    return this
  }

  onCanvasLeftMouseUp(e) {
    let p0 = this.entity.selection.p0
    let p1 = this.entity.selection.p1
    let [x0, x1] = p0.x < p1.x ? [p0.x, p1.x] : [p1.x, p0.x]
    let [y0, y1] = p0.y < p1.y ? [p0.y, p1.y] : [p1.y, p0.y]
    let tilesResource = this.manager.ecs.getResource('tiles')

    for (let x = x0; x <= x1; x++) {
      tilesResource[x] ||= []
      for (let y = y0; y <= y1; y++) {
	if (tilesResource[x][y]) continue
	this.manager.ecs.newEntity(newHullBlock(x, y))
	tilesResource[x][y] = true
      }
    }

    this.manager.ecs.removeEntity(this.entity)

    return new PaintHullInitialState(this.manager)
  }

  onCanvasRightMouseDown(e) {
    this.manager.ecs.removeEntity(this.entity)
    return new PaintHullInitialState(this.manager)
  }
}
