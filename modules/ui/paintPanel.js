import * as css from '/modules/css.js'

import * as paintHull from './behavior/paintHull.js'

const canvas = document.querySelector('#canvas')
const paintHullToggle = document.querySelector('#btn-paint-hull')
const eraseToggle = document.querySelector('#btn-erase')

export function install({ ecs }) {
  let panel = new PaintPanel(ecs)

  paintHullToggle.addEventListener('click', e => panel.togglePaintHull(ecs))
  eraseToggle.addEventListener('click', e => panel.toggleErase(ecs))

  canvas.addEventListener('mousedown', e => panel.mousedown(e))
  canvas.addEventListener('mousemove', e => panel.mousemove(e))
  canvas.addEventListener('mouseup', e => panel.mouseup(e))
}

class PaintPanel {
  constructor(ecs) {
    this.state = 'pan'
    this.mouseBehavior = panMouseBehavior(ecs, this)
  }

  togglePaintHull(ecs) {
    if (this.state === 'paintHull' || this.state === 'external') {
      css.styleButtonInactive(paintHullToggle)
      this.state = 'pan'
      this.mouseBehavior = panMouseBehavior(ecs, this)
    } else {
      css.styleButtonActive(paintHullToggle)
      this.state = 'paintHull'
      this.mouseBehavior = paintHullMouseBehavior(ecs, this)
    }
  }

  toggleErase(ecs) {
    if (this.state === 'paintHull' || this.state === 'pan') {
      css.styleButtonInactive(paintHullToggle)
      this.state = 'external'
      this.mouseBehavior = emptyMouseBehavior()
    } else if (this.state === 'external') {
      this.state = 'pan'
      this.mouseBehavior = panMouseBehavior(ecs, this)
    }
  }

  mousedown(e) {
    this.mouseBehavior.mousedown(e)
  }

  mousemove(e) {
    this.mouseBehavior.mousemove(e)
  }

  mouseup(e) {
    this.mouseBehavior.mouseup(e)
  }
}

function emptyMouseBehavior() {
  return {
    mousedown(e) {},
    mouseup(e) {},
    mousemove(e) {},
  }
}

function panMouseBehavior(ecs, panel) {
  return {
    mousedown(e) {
      if (e.button === 0) {
        this.drag = true
      }
    },

    mouseup(e) {
      if (e.button === 0) {
        this.drag = false
      } else if (e.button === 2) {
        panel.togglePaintHull(ecs)
      }
    },

    mousemove(e) {
      if (this.drag) {
        ecs.updateResource('camera', c => {
          c.offsetX += e.movementX
          c.offsetY += e.movementY
        })
      }
    },
  }
}

function paintHullMouseBehavior(ecs, panel) {
  return {
    mousedown(e) {
      if (e.button === 0) {
        this.entity = paintHull.startPaintHullSelection(ecs, e)
      }
    },

    mouseup(e) {
      if (this.entity) {
        if (e.button === 0) {
          paintHull.commitPaintHullSelection(ecs, this.entity, e)
          this.entity = null
        } else if (e.button === 2) {
          paintHull.cancelPaintHullSelection(ecs, this.entity)
          this.entity = null
        }
      } else {
        panel.togglePaintHull(ecs)
      }
    },

    mousemove(e) {
      if (this.entity) {
        paintHull.updatePaintHullSelection(ecs, this.entity, e)
      }
    },
  }
}


