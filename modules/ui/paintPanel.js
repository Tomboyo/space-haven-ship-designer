import * as css from '/modules/css.js'

import * as selection from './behavior/selection.js'
import { paintHull } from './behavior/paintHull.js'
import { erase } from './behavior/erase.js'

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
    switch (this.state) {
      case 'paintHull':
        css.styleButtonInactive(paintHullToggle)
        this.state = 'pan'
        this.mouseBehavior = panMouseBehavior(ecs, this)
        return
      case 'erase':
        css.styleButtonInactive(eraseToggle)
        // fall through
      case 'pan':
        css.styleButtonActive(paintHullToggle)
        this.state = 'paintHull'
        this.mouseBehavior = paintHullMouseBehavior(ecs, this)
        return
    }
  }

  toggleErase(ecs) {
    switch (this.state) {
      case 'erase':
        css.styleButtonInactive(eraseToggle)
        this.state = 'pan'
        this.mouseBehavior = panMouseBehavior(ecs, this)
        return
      case 'paintHull':
        css.styleButtonInactive(paintHullToggle)
        // fall through
      case 'pan':
        css.styleButtonActive(eraseToggle)
        this.state = 'erase'
        this.mouseBehavior = eraseMouseBehavior(ecs, this)
        return
    }
  }

  cancel(ecs) {
    switch (this.state) {
      case 'erase':
        css.styleButtonInactive(eraseToggle)
        // fall through
      case 'paintHull':
        css.styleButtonInactive(paintHullToggle)
        this.mouseBehavior = panMouseBehavior(ecs, this)
        this.state = 'pan'
        return
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
  return withSelection(ecs, panel, paintHull)
}

function eraseMouseBehavior(ecs, panel) {
  return withSelection(ecs, panel, erase)
}

function withSelection(ecs, panel, commit) {
  return {
    mousedown(e) {
      if (e.button === 0) {
        this.selection = selection.create(ecs, e)
      }
    },

    mouseup(e) {
      if (this.selection) {
        if (e.button === 0) {
          commit(ecs, this.selection)
          selection.remove(ecs, this.selection)
          this.selection = null
        } else if (e.button === 2) {
          selection.remove(ecs, this.selection)
          this.selection = null
        }
      } else {
        panel.cancel(ecs)
      }
    },

    mousemove(e) {
      if (this.selection) {
        selection.expand(ecs, this.selection, e)
      }
    },
  }
}


