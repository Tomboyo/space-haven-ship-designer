import { styleButtonActive, styleButtonInactive } from '../css.js'
import { getTileCoordinates } from '../util.js'

import { PaintHullInitialState } from './paintHullStates.js'
import { EraseHullInitialState } from './eraseHullStates.js'
import { PanState } from './panState.js'

export class PaintModuleInitialState {
  constructor(manager, e) {
    this.manager = manager
    this.entity = this.manager.ecs.newEntity({
	module: {
	  border: '#fff8',
	  fill: '#f008',
	},
        position: getTileCoordinates(e, this.manager.ecs),
      })
  }

  onPaintHullToggleClick() {
    styleButtonInactive(this.manager.ui.paintModuleToggle)
    styleButtonActive(this.manager.ui.paintHullToggle)
    this.manager.ecs.removeEntity(this.entity)
    return new PaintHullInitialState(this.manager)
  }

  onEraseHullToggleClick() {
    styleButtonInactive(this.manager.ui.paintModuleToggle)
    styleButtonActive(this.manager.ui.eraseHullToggle)
    this.manager.ecs.removeEntity(this.entity)
    return new EraseHullInitialState(this.manager)
  }

  onPaintModuleToggleClick() {
    styleButtonInactive(this.manager.ui.paintModuleToggle)
    this.manager.ecs.removeEntity(this.entity)
    return new PanState(this.manager)
  }

  onCanvasLeftMouseDown(e) {
    this.manager.ecs.removeEntity(this.entity)
    let p = getTileCoordinates(e, this.manager.ecs)
    this.manager.ecs.newEntity({
      module: {
	border: '#fffc',
	fill: '#f00c',
      },
      position: p, 
    })
    this.entity = this.manager.ecs.newEntity({
      module: {
	border: '#fff8',
	fill: '#f008',
      },
      position: p
    })
  }

  onCanvasRightMouseDown(e) {
    styleButtonInactive(this.manager.ui.paintModuleToggle)
    this.manager.ecs.removeEntity(this.entity)
    return new PanState(this.manager)
  }

  onCanvasMouseMove(e) {
    let p = getTileCoordinates(e, this.manager.ecs)
    this.manager.ecs.updateEntity(this.entity, entity => entity.position = p)
    return this
  }
}
