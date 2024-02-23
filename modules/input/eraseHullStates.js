import { styleButtonActive, styleButtonInactive } from '../css.js'
import { getTileCoordinates } from '../util.js'

import { PanState } from './panState.js'
import { PaintHullInitialState } from './paintHullStates.js'
import { PaintModuleInitialState } from './paintModuleStates.js'

export class EraseHullInitialState {
  constructor(manager) {
    this.manager = manager
  }

  onPaintHullToggleClick() {
    styleButtonActive(this.manager.ui.paintHullToggle)
    styleButtonInactive(this.manager.ui.eraseHullToggle)
    return new PaintHullInitialState(this.manager)
  }

  onEraseHullToggleClick() {
    styleButtonInactive(this.manager.ui.eraseHullToggle)
    return new PanState(this.manager)
  }

  onPaintModuleToggleClick() {
    styleButtonActive(this.manager.ui.paintModuleToggle)
    styleButtonInactive(this.manager.ui.eraseHullToggle)
    return new PaintModuleInitialState(this.manager)
  }

  onCanvasLeftMouseDown(e) {
    let p = getTileCoordinates(e, this.manager.ecs)
    let entity = this.manager.ecs.newEntity({ 'selection': { p0: p, p1: p }})
    return new EraseHullSelectingState(this.manager, entity)
  }
}

class EraseHullSelectingState {
  constructor(manager, entity) {
    this.manager = manager
    this.entity = entity
  }

  onCanvasRightMouseDown(e) {
    this.manager.ecs.removeEntity(this.entity)
    return new EraseHullInitialState(this.manager)
  }

  onCanvasMouseMove(e) {
    let p = getTileCoordinates(e, this.manager.ecs)
    this.manager.ecs.updateEntity(this.entity, entity => entity.selection.p1 = p)
    return this
  }

  onCanvasLeftMouseUp(e) {
    let p0 = this.entity.selection.p0
    let p1 = this.entity.selection.p1
    let [x0, x1] = p0.x < p1.x ? [p0.x, p1.x] : [p1.x, p0.x]
    let [y0, y1] = p0.y < p1.y ? [p0.y, p1.y] : [p1.y, p0.y]
    let tilesResource = this.manager.ecs.getResource('tiles')

    for (let x = x0; x <= x1; x++) {
      if (!tilesResource[x]) continue
      for (let y = y0; y <= y1; y++) {
	let entity = tilesResource[x][y]
	if (!entity) continue
	this.manager.ecs.removeEntity(entity)
	this.manager.ecs.updateResource('tiles', t => t[x][y] = null)
      }
    }
    this.manager.ecs.removeEntity(this.entity)
    return new EraseHullInitialState(this.manager)
  }
}
