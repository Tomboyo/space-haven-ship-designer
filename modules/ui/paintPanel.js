import * as css from '/modules/css.js'

import * as selection from './behavior/selection.js'
import { paintHull } from './behavior/paintHull.js'
import { erase } from './behavior/erase.js'

const canvas = document.querySelector('#canvas')
const paintHullToggle = document.querySelector('#btn-paint-hull')
const eraseToggle = document.querySelector('#btn-erase')

export function install({ ecs }) {
  new Panel(ecs)
}

/* Note: Panel is two things:
 * 1: The paint panel and all of its buttons
 * 2: A tool palette that switches between brushes, with at most one active
 * Consider extracting 2 in the future if we need a second palette
 */
class Panel {
  constructor(ecs) {
    let cancel = () => this.onBrushCancel()

    this.defaultBrush = panBrush(ecs)
    this.defaultBrush.activate()
    this.active = this.defaultBrush

    let buttons = [
      new BrushButton(paintHullToggle, selectionBrush(ecs, cancel, paintHull)),
      new BrushButton(eraseToggle, selectionBrush(ecs, cancel, erase))
    ]
   
    buttons.forEach(brushButton => brushButton.element.addEventListener(
      'click',
      e => this.onClickBrushButton(brushButton)))
  }

  onClickBrushButton(button) {
    if (this.active === button) {
      button.deactivate()
      this.defaultBrush.activate()
      this.active = this.defaultBrush
    } else {
      this.active?.deactivate()
      this.active = button
      button.activate()
    }
  }

  onBrushCancel() {
    this.active?.deactivate()
    this.defaultBrush.activate()
    this.active = this.defaultBrush
  }
}

class BrushButton {
  constructor(element, brush) {
    this.element = element
    this.brush = brush
  }

  activate() {
    css.styleButtonActive(this.element)
    this.brush.activate()
  }

  deactivate() {
    css.styleButtonInactive(this.element)
    this.brush.deactivate()
  }
}

class Brush {
  constructor({ mousedown, mouseup, mousemove }) {
    this.mousedown = mousedown
    this.mouseup = mouseup
    this.mousemove = mousemove
  }

  activate() {
    canvas.addEventListener('mousedown', this.mousedown)
    canvas.addEventListener('mouseup', this.mouseup)
    canvas.addEventListener('mousemove', this.mousemove)
  }

  deactivate() {
    canvas.removeEventListener('mousedown', this.mousedown)
    canvas.removeEventListener('mouseup', this.mouseup)
    canvas.removeEventListener('mousemove', this.mousemove)
  }
}

function panBrush(ecs) {
  return new Brush({
    mousedown(e) {
      if (e.button === 0) {
        this.drag = true
      }
    },

    mouseup(e) {
      if (e.button === 0) {
        this.drag = false
      }
    },

    mousemove(e) {
      if (this.drag) {
        ecs.updateResource('camera', c => {
          c.offsetX += e.movementX
          c.offsetY += e.movementY
        })
      }
    }
  })
}

function selectionBrush(ecs, onCancel, onCommit) {
  return new Brush({
    mousedown(e) {
      if (e.button === 0) {
        this.selection = selection.create(ecs, e)
      }
    },

    mouseup(e) {
      if (this.selection) {
        if (e.button === 0) {
          onCommit(ecs, this.selection)
          selection.remove(ecs, this.selection)
          this.selection = null
        } else if (e.button === 2) {
          selection.remove(ecs, this.selection)
          this.selection = null
        }
      } else {
        onCancel()
      }
    },

    mousemove(e) {
      if (this.selection) {
        selection.expand(ecs, this.selection, e)
      }
    }
  })
}


