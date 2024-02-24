import { styleButtonActive } from '../css.js'

import { PaintHullInitialState } from './paintHullStates.js'
import { EraseHullInitialState } from './eraseHullStates.js'
import { PaintModuleInitialState } from './paintModuleStates.js'

export class PanState {
  constructor(manager) {
    this.manager = manager
    this.isDrag = false
  }

  onPaintHullToggleClick() {
    styleButtonActive(this.manager.ui.paintHullToggle)
    return new PaintHullInitialState(this.manager)
  }

  onEraseHullToggleClick() {
    styleButtonActive(this.manager.ui.eraseHullToggle)
    return new EraseHullInitialState(this.manager)
  }

  onPaintModuleToggleClick(e, module) {
    styleButtonActive(e.target)
    return new PaintModuleInitialState(this.manager, e, module)
  }

  onCanvasLeftMouseDown(e) {
    this.isDrag = true
  }

  onCanvasMouseMove(e) {
    if (this.isDrag) {
      this.manager.ecs.updateResource('camera', c => {
	c.offsetX += e.movementX
        c.offsetY += e.movementY
      })
    }
  }

  onCanvasLeftMouseUp(e) {
    this.isDrag = false
  }
}
