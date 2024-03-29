import { rem, styleButtonActive, styleButtonInactive } from './css.js'
import { PanState } from './input/panState.js'

const ui = {
  paintHullToggle: document.querySelector('#btn-paint-hull'),
  eraseHullToggle: document.querySelector('#btn-erase'),
  paintModuleToggle: document.querySelector('#btn-paint-module'),
}

export class InputManager {
  constructor(ecs, frameScheduler) {
    this.ecs = ecs
    this.frameScheduler = frameScheduler

    this.ui = ui
    this.state = new PanState(this)

    this.addEventListeners()
  }

  addEventListeners() {
    let canvas = document.querySelector('#canvas')

    window.addEventListener('keydown', e => this.onKeyDown(e))
    window.addEventListener('resize', e => this.onResize(e))

    canvas.addEventListener('wheel', e => this.onCanvasWheel(e))
    canvas.addEventListener('mousedown', (e) => this.onCanvasMouseDown(e))
    canvas.addEventListener('mousemove', (e) => this.onCanvasMouseMove(e))
    canvas.addEventListener('mouseup', (e) => this.onCanvasMouseUp(e))

    document.querySelector('#btn-paint-hull').addEventListener('click', (e) => this.onPaintHullToggleClick(e))
    document.querySelector('#btn-erase').addEventListener('click', (e) => this.onEraseHullToggleClick(e))
  }

  handle(which) {
    this.state = this.state[which]?.(...Array.prototype.slice.call(arguments, 1)) || this.state
    if (this.ecs.isDirty) {
      this.frameScheduler.requestFrame(() => this.ecs.run())
    }
  }

  onCanvasWheel(e) {
    this.ecs.updateResource('grid', g => {
      g.s += rem() * e.deltaY * -0.00075
    })

    this.handle('onCanvasWheel', ...arguments)
  }

  onResize() {
    this.ecs.updateResource('canvas', c => {
      let rect = c.parentNode.getBoundingClientRect()
      c.width = rect.width
      c.height = rect.height
    })

    this.handle('onResize', ...arguments)
  }

  onPaintHullToggleClick() {
    this.handle('onPaintHullToggleClick', ...arguments)
  }

  onEraseHullToggleClick() {
    this.handle('onEraseHullToggleClick', ...arguments)
  }

  onPaintModuleToggleClick() {
    this.handle('onPaintModuleToggleClick', ...arguments)
  }

  onCanvasMouseDown(e) {
    if (e.button === 0) {
      this.handle('onCanvasLeftMouseDown', ...arguments)
    } else if (e.button === 2) {
      this.handle('onCanvasRightMouseDown', ...arguments)
    }
  }

  onCanvasMouseUp(e) {
    if (e.button === 0) {
      this.handle('onCanvasLeftMouseUp', ...arguments)
    } else if (e.button === 2) {
      this.handle('onCanvasRightMouseUp', ...arguments)
    }
  }

  onCanvasMouseMove(e) {
    this.handle('onCanvasMouseMove', ...arguments)
  }

  onKeyDown(e) {
    this.handle('onKeyDown', ...arguments)
  }
}

