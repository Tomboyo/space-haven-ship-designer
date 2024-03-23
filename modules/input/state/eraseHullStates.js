import { styleButtonActive, styleButtonInactive } from '/modules/css.js'
import { getTileCoordinates } from '/modules/util.js'

import paintPanelUi from '../ui/paintPanelUi.js'

import { PanState } from './panState.js'
import { PaintHullInitialState } from './paintHullStates.js'
import { PaintModuleInitialState } from './paintModuleStates.js'

export class EraseHullInitialState {
  constructor(ecs) {
    this.ecs = ecs
  }

  onPaintHullToggleClick() {
    styleButtonActive(paintPanelUi.dom.paintHullToggle)
    styleButtonInactive(paintPanelUi.dom.eraseToggle)
    return new PaintHullInitialState(this.ecs)
  }

  onEraseHullToggleClick() {
    styleButtonInactive(paintPanelUi.dom.eraseToggle)
    return new PanState(this.ecs)
  }

  onPaintModuleToggleClick(e, module) {
    styleButtonActive(e.target)
    styleButtonInactive(paintPanelUi.dom.eraseToggle)
    return new PaintModuleInitialState(this.ecs, e, module)
  }

  onCanvasLeftMouseDown(e) {
    let p = getTileCoordinates(e, this.ecs)
    let entity = this.ecs.newEntity({ 'selection': { p0: p, p1: p }})
    return new EraseHullSelectingState(this.ecs, entity)
  }

  onCanvasRightMouseDown(e) {
    styleButtonInactive(paintPanelUi.dom.eraseToggle)
    return new PanState(this.ecs)
  }
}

class EraseHullSelectingState {
  constructor(ecs, entity) {
    this.ecs = ecs
    this.entity = entity
  }

  onCanvasRightMouseDown(e) {
    this.ecs.removeEntity(this.entity)
    return new EraseHullInitialState(this.ecs)
  }

  onCanvasMouseMove(e) {
    let p = getTileCoordinates(e, this.ecs)
    this.ecs.updateEntity(this.entity, entity => entity.selection.p1 = p)
    return this
  }

  onCanvasLeftMouseUp(e) {
    let p0 = this.entity.selection.p0
    let p1 = this.entity.selection.p1
    let [x0, x1] = p0.x < p1.x ? [p0.x, p1.x] : [p1.x, p0.x]
    let [y0, y1] = p0.y < p1.y ? [p0.y, p1.y] : [p1.y, p0.y]
    let tilesResource = this.ecs.getResource('tiles')

    this.ecs.entityQuery(
      ['tiles'],
      ['id', 'position', 'tile'],
      (tiles, {id, position: {x, y}}, buffer) => {
	if (x0 <= x && x <= x1 && y0 <= y && y <= y1) {
	  buffer.removeEntity(id)
	  if (tiles[x]) delete tiles[x][y]
	}
      })

    this.ecs.entityQuery(
      [],
      ['id', 'position', 'module'],
      ({id, position: {x, y}, module: {tiles}}, buffer) => {
	/* Note: not checking isGhost because there shouldn't be any during erase, and
	 * if there are, the user may as well have a way to remove them. */
	let intersection = Object.values(tiles).flat().find(rect => {
	  let bx0 = x + rect.offsetX
	  let bx1 = x + rect.offsetX + rect.width - 1
	  let by0 = y + rect.offsetY
	  let by1 = y + rect.offsetY+ rect.height - 1
	  return x0 <= bx1 && x1 >= bx0 && y0 <= by1 && y1 >= by0
	})
	if (intersection) {
          buffer.removeEntity(id)
	}
      })

    this.ecs.removeEntity(this.entity)
    return new EraseHullInitialState(this.ecs)
  }
}
