import { styleButtonActive, styleButtonInactive } from '/modules/css.js'
import { getTileCoordinates } from '/modules/util.js'

import { newHullBlock } from '/modules/component/hullBlock.js'

import paintPanelUi from '../ui/paintPanelUi.js'

import { PanState } from './panState.js'
import { EraseHullInitialState } from './eraseHullStates.js'
import { PaintModuleInitialState } from './paintModuleStates.js'

export class PaintHullInitialState {
  constructor (ecs) {
    this.ecs = ecs
  }

  onPaintHullToggleClick() {
    styleButtonInactive(paintPanelUi.dom.paintHullToggle)
    return new PanState(this.ecs)
  }

  onEraseHullToggleClick() {
    styleButtonActive(paintPanelUi.dom.eraseHullToggle)
    styleButtonInactive(paintPanelUi.dom.paintHullToggle)
    return new EraseHullInitialState(this.ecs)
  }

  onPaintModuleToggleClick(e, module) {
    styleButtonInactive(paintPanelUi.dom.paintHullToggle)
    styleButtonActive(e.target)
    return new PaintModuleInitialState(this.ecs, e, module)
  }

  onCanvasLeftMouseDown(e) {
    let p = getTileCoordinates(e, this.ecs)
    let entity = this.ecs.newEntity({ 'selection': {p0: p, p1: p}})
    return new PaintHullSelectingState(this.ecs, entity)
  }

  onCanvasRightMouseDown(e) {
    styleButtonInactive(paintPanelUi.dom.paintHullToggle)
    return new PanState(this.ecs)
  }
}

class PaintHullSelectingState {
  constructor(ecs, entity) {
    this.ecs = ecs
    this.entity = entity
  }

  onCanvasMouseMove(e) {
    this.ecs.updateEntity(this.entity, entity => 
        entity.selection.p1 = getTileCoordinates(e, this.ecs))
    return this
  }

  onCanvasLeftMouseUp(e) {
    let p0 = this.entity.selection.p0
    let p1 = this.entity.selection.p1
    let [x0, x1] = p0.x < p1.x ? [p0.x, p1.x] : [p1.x, p0.x]
    let [y0, y1] = p0.y < p1.y ? [p0.y, p1.y] : [p1.y, p0.y]
    let tilesResource = this.ecs.getResource('tiles')

    for (let x = x0; x <= x1; x++) {
      tilesResource[x] ||= []
      for (let y = y0; y <= y1; y++) {
	if (tilesResource[x][y]) continue
	this.ecs.newEntity(newHullBlock(x, y))
	tilesResource[x][y] = true
      }
    }

    this.ecs.removeEntity(this.entity)

    return new PaintHullInitialState(this.ecs)
  }

  onCanvasRightMouseDown(e) {
    this.ecs.removeEntity(this.entity)
    return new PaintHullInitialState(this.ecs)
  }
}
