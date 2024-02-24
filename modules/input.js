import { rem, styleButtonActive, styleButtonInactive } from './css.js'
import { PanState } from './input/panState.js'

const ui = {
  paintHullToggle: document.querySelector('#btn-paint-hull'),
  eraseHullToggle: document.querySelector('#btn-erase-hull'),
  paintModuleToggle: document.querySelector('#btn-paint-module'),
}

export class InputManager {
  constructor(ecs, frameScheduler) {
    this.ecs = ecs
    this.frameScheduler = frameScheduler

    this.ui = ui
    this.state = new PanState(this)
  }

  handle(which, e) {
    this.state = this.state[which]?.(e) || this.state
    if (this.ecs.isDirty) {
      this.frameScheduler.requestFrame(() => this.ecs.run())
    }
  }

  onWheel(e) {
    this.ecs.updateResource('grid', g => {
      g.s += rem() * e.deltaY * -0.00075
    })

    this.handle('onWheel', e)
  }

  onResize(e) {
    this.ecs.updateResource('canvas', c => {
      c.width = window.innerWidth
      c.height = window.innerHeight
    })

    this.handle('onResize', e)
  }

  onPaintHullToggleClick(e) {
    this.handle('onPaintHullToggleClick', e)
  }

  onEraseHullToggleClick(e) {
    this.handle('onEraseHullToggleClick', e)
  }

  onPaintModuleToggleClick(e) {
    this.handle('onPaintModuleToggleClick', e)
  }

  onCanvasMouseDown(e) {
    if (e.button === 0) {
      this.handle('onCanvasLeftMouseDown', e)
    } else if (e.button === 2) {
      this.handle('onCanvasRightMouseDown', e)
    }
  }

  onCanvasMouseUp(e) {
    if (e.button === 0) {
      this.handle('onCanvasLeftMouseUp', e)
    } else if (e.button === 2) {
      this.handle('onCanvasRightMouseUp', e)
    }
  }

  onCanvasMouseMove(e) {
    this.handle('onCanvasMouseMove', e)
  }
}

