import { styleButtonActive } from '/modules/css.js'

import paintPanelUi from '../ui/paintPanelUi.js'

import { PaintHullInitialState } from './paintHullStates.js'
import { EraseHullInitialState } from './eraseHullStates.js'
import { PaintModuleInitialState } from './paintModuleStates.js'

export class PanState {
  constructor(ecs) {
    this.ecs = ecs
    this.isDrag = false
  }

  onPaintHullToggleClick() {
    styleButtonActive(paintPanelUi.dom.paintHullToggle)
    return new PaintHullInitialState(this.ecs)
  }

  onEraseHullToggleClick() {
    styleButtonActive(paintPanelUi.dom.eraseToggle)
    return new EraseHullInitialState(this.ecs)
  }

  onPaintModuleToggleClick(e, module) {
    styleButtonActive(e.target)
    return new PaintModuleInitialState(this.ecs, e, module)
  }

  onCanvasLeftMouseDown(e) {
    this.isDrag = true
  }

  onCanvasMouseMove(e) {
    if (this.isDrag) {
      this.ecs.updateResource('camera', c => {
	c.offsetX += e.movementX
        c.offsetY += e.movementY
      })
    }
  }

  onCanvasLeftMouseUp(e) {
    this.isDrag = false
  }
}
