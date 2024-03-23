import { styleButtonActive, styleButtonInactive } from '/modules/css.js'
import { getTileCoordinates } from '/modules/util.js'

import { newModule } from '/modules/component/module.js'

import paintPanelUi from '../ui/paintPanelUi.js'

import { PaintHullInitialState } from './paintHullStates.js'
import { EraseHullInitialState } from './eraseHullStates.js'
import { PanState } from './panState.js'

export class PaintModuleInitialState {
  constructor(ecs, e, module) {
    this.ecs = ecs
    this.activeButton = e.target
    this.module = module
    this.rotation = 0
    this.entity = ecs.newEntity(
      newModule(
	module,
        true,
	getTileCoordinates(e, ecs),
	this.rotation))
  }

  onPaintHullToggleClick() {
    styleButtonInactive(this.activeButton)
    styleButtonActive(paintPanelUi.dom.paintHullToggle)
    this.ecs.removeEntity(this.entity)
    return new PaintHullInitialState(this.ecs)
  }

  onEraseHullToggleClick() {
    styleButtonInactive(this.activeButton)
    styleButtonActive(paintPanelUi.dom.eraseHullToggle)
    this.ecs.removeEntity(this.entity)
    return new EraseHullInitialState(this.ecs)
  }

  onPaintModuleToggleClick(e, module) {
    styleButtonInactive(this.activeButton)
    this.ecs.removeEntity(this.entity)
    if (e.target === this.activeButton) {
      return new PanState(this.ecs)
    } else {
      styleButtonActive(e.target)
      return new PaintModuleInitialState(this.ecs, e, module)
    }
  }

  onCanvasLeftMouseDown(e) {
    this.ecs.removeEntity(this.entity)
    let p = getTileCoordinates(e, this.ecs)
    this.ecs.newEntity(newModule(this.module, false, p, this.rotation))
    this.entity = this.ecs.newEntity(newModule(this.module, true, p, this.rotation))
  }

  onCanvasRightMouseDown(e) {
    styleButtonInactive(this.activeButton)
    this.ecs.removeEntity(this.entity)
    return new PanState(this.ecs)
  }

  onCanvasMouseMove(e) {
    let p = getTileCoordinates(e, this.ecs)
    this.ecs.updateEntity(this.entity, entity => entity.position = p)
    return this
  }

  onKeyDown(e) {
    if (e.key === 'e') { // clockwise
      this.rotation = (this.rotation + 1) % 4
      this.ecs.removeEntity(this.entity)
      this.entity = this.ecs.newEntity(newModule(this.module, true, this.entity.position, this.rotation))
    } else if (e.key === 'q') { // counter-clockwise
      this.rotation = (this.rotation - 1)
      if (this.rotation < 0) this.rotation += 4
      this.ecs.removeEntity(this.entity)
      this.entity = this.ecs.newEntity(newModule(this.module, true, this.entity.position, this.rotation))
    }
  }
}
