import { styleButtonActive } from '../css.js'

import { PaintHullInitialState } from './paintHullStates.js'

export class PanState {
  constructor(manager) {
    this.manager = manager
    this.isDrag = false
  }


  onPaintHullToggleClick() {
    styleButtonActive(this.manager.ui.paintHullToggle)
    return new PaintHullInitialState(this.manager)
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
