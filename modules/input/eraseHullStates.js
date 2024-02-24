import { styleButtonActive, styleButtonInactive } from '../css.js'
import { getTileCoordinates } from '../util.js'

import { modules } from '../component/modules.js'

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

  onPaintModuleToggleClick(e, module) {
    styleButtonActive(e.target)
    styleButtonInactive(this.manager.ui.eraseHullToggle)
    return new PaintModuleInitialState(this.manager, e, module)
  }

  onCanvasLeftMouseDown(e) {
    let p = getTileCoordinates(e, this.manager.ecs)
    let entity = this.manager.ecs.newEntity({ 'selection': { p0: p, p1: p }})
    return new EraseHullSelectingState(this.manager, entity)
  }

  onCanvasRightMouseDown(e) {
    styleButtonInactive(this.manager.ui.eraseHullToggle)
    return new PanState(this.manager)
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

    this.manager.ecs.entityQuery(
      ['tiles'],
      ['id', 'position', 'tile'],
      (tiles, {id, position: {x, y}}, buffer) => {
	if (x0 <= x && x <= x1 && y0 <= y && y <= y1) {
	  buffer.removeEntity(id)
	  if (tiles[x]) delete tiles[x][y]
	}
      })

    this.manager.ecs.entityQuery(
      [],
      ['id', 'position', 'module'],
      ({id, position: {x, y}, module: {category, name}}, buffer) => {
	/* Note: not checking isGhost because there shouldn't be any during erase, and
	 * if there are, the user may as well have a way to remove them. */
	let proto = modules[category][name]
	let intersection = Object.values(proto).flat().find(box => {
	  let bx0 = x + (box.offsetX || 0)
	  let bx1 = x + (box.offsetX || 0) + box.width - 1
	  let by0 = y + (box.offsetY || 0)
	  let by1 = y + (box.offsetY || 0) + box.height - 1
	  return x0 <= bx1 && x1 >= bx0 && y0 <= by1 && y1 >= by0
	})
	if (intersection) {
          buffer.removeEntity(id)
	}
      })

    this.manager.ecs.removeEntity(this.entity)
    return new EraseHullInitialState(this.manager)
  }
}
