import { styleButtonActive, styleButtonInactive } from '../css.js'
import { getTileCoordinates } from '../util.js'

import { newModule } from '../component/module.js'

import { PaintHullInitialState } from './paintHullStates.js'
import { EraseHullInitialState } from './eraseHullStates.js'
import { PanState } from './panState.js'

export class PaintModuleInitialState {
  constructor(manager, e, module) {
    this.manager = manager
    this.activeButton = e.target
    this.module = module
    this.entity = this.manager.ecs.newEntity(
      newModule(
	module,
        true,
	getTileCoordinates(e, this.manager.ecs)))
  }

  onPaintHullToggleClick() {
    styleButtonInactive(this.activeButton)
    styleButtonActive(this.manager.ui.paintHullToggle)
    this.manager.ecs.removeEntity(this.entity)
    return new PaintHullInitialState(this.manager)
  }

  onEraseHullToggleClick() {
    styleButtonInactive(this.activeButton)
    styleButtonActive(this.manager.ui.eraseHullToggle)
    this.manager.ecs.removeEntity(this.entity)
    return new EraseHullInitialState(this.manager)
  }

  onPaintModuleToggleClick(e, module) {
    styleButtonInactive(this.activeButton)
    this.manager.ecs.removeEntity(this.entity)
    if (e.target === this.activeButton) {
      return new PanState(this.manager)
    } else {
      styleButtonActive(e.target)
      return new PaintModuleInitialState(this.manager, e, module)
    }
  }

  onCanvasLeftMouseDown(e) {
    this.manager.ecs.removeEntity(this.entity)
    let p = getTileCoordinates(e, this.manager.ecs)
    this.manager.ecs.newEntity(newModule(this.module, false, p))
    this.entity = this.manager.ecs.newEntity(newModule(this.module, true, p))
  }

  onCanvasRightMouseDown(e) {
    styleButtonInactive(this.activeButton)
    this.manager.ecs.removeEntity(this.entity)
    return new PanState(this.manager)
  }

  onCanvasMouseMove(e) {
    let p = getTileCoordinates(e, this.manager.ecs)
    this.manager.ecs.updateEntity(this.entity, entity => entity.position = p)
    return this
  }
}
