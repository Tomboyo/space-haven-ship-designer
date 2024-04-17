import * as css from '/modules/css.js'

import { getTileCoordinates } from '/modules/util.js'

import { modules } from '/modules/component/modules.js'
import { newModule } from '/modules/component/module.js'

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

    let moduleBrushButtons = installCarousel(modules, ecs, cancel)
    let buttons = [
      new BrushButton(paintHullToggle, selectionBrush(ecs, cancel, paintHull)),
      new BrushButton(eraseToggle, selectionBrush(ecs, cancel, erase)),
      ...moduleBrushButtons
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
  constructor(strategy) {
    let { mousedown, mouseup, mousemove, keydown } = strategy
    this.mousedown = mousedown?.bind(strategy)
    this.mouseup = mouseup?.bind(strategy)
    this.mousemove = mousemove?.bind(strategy)
    this.keydown = keydown?.bind(strategy)
  }

  activate() {
    this.mousedown && canvas.addEventListener('mousedown', this.mousedown)
    this.mouseup && canvas.addEventListener('mouseup', this.mouseup)
    this.mousemove && canvas.addEventListener('mousemove', this.mousemove)
    this.keydown && window.addEventListener('keydown', this.keydown)
  }

  deactivate() {
    this.mousedown && canvas.removeEventListener('mousedown', this.mousedown)
    this.mouseup && canvas.removeEventListener('mouseup', this.mouseup)
    this.mousemove && canvas.removeEventListener('mousemove', this.mousemove)
    this.keydown && window.removeEventListener('keydown', this.keydown)
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

function installCarousel(modules, ecs, onCancel) {
  const select = document.querySelector('#select-module-kind')
  const carousel = document.querySelector('#modules-carousel')
  
  installCarouselSelect(select, carousel)
  
  let map = modules
    .reduce(
      (acc, module) => {
        if (!acc.get(module.category)) {
          acc.set(module.category, [])
        }
        acc.get(module.category).push(module)
        return acc
      },
      new Map())

  let brushButtons = []
  for (let item of map) {
      let [category, catModules] = item
      let option = createCarouselOption(category)
      select.appendChild(option)

      let shelf = createCarouselShelf(category)
      carousel.appendChild(shelf)

      if (brushButtons.length === 0) {
        option.setAttribute('selected', true)
        shelf.style.display = null
      }

      catModules
        .map(module => createCarouselModuleBrushButton(ecs, module, onCancel))
        .forEach(bb => {
          shelf.appendChild(bb.element)
          brushButtons.push(bb)
        })
  }

  select.value = modules[0].category

  return brushButtons
}

function installCarouselSelect(element, carousel) {
  element.addEventListener('change', e => {
    for (let child of carousel.children) {
      child.style.display = 'none'
    }
    let category = e.target.value
    document.querySelector(`#${categoryId(category)}`).style.display = null
  })
}

function createCarouselOption(category) {
  let element = document.createElement('option')
  element.value = category
  element.innerHTML = category
  return element
}

function createCarouselShelf(category) {
  let element = document.createElement('div')
  element.setAttribute('id', categoryId(category))
  element.classList.add('flex-button-row')
  element.style.display = 'none'
  return element
}

function categoryId(category) {
  return `carousel-shelf-${category.toLowerCase().replace(' ', '-')}`
}

function createCarouselModuleBrushButton(ecs, module, onCancel) {
  let button = document.createElement('button')
  button.innerHTML = module.name
  return new BrushButton(button, new Brush(paintModuleBrush(ecs, module, onCancel)))
}

function paintModuleBrush(ecs, module, onCancel) {
  return {
    mousedown(e) {
      if (e.button === 0) {
        let p = getTileCoordinates(e, ecs)
        ecs.newEntity(newModule(module, false, p, this.rotation))
      } else if (e.button === 2) {
        if (this.entity) {
          ecs.removeEntity(this.entity)
          this.entity = null
          onCancel()
        }
      }
    },

    mousemove(e) {
      let p = getTileCoordinates(e, ecs)
      if (!this.entity) {
        /* Create ghost when the cursor enters the canvas */
        this.rotation = 0
        this.entity = ecs.newEntity(newModule(
          module,
          true,
          p,
          this.rotation))
      } else {
        ecs.updateEntity(this.entity, it => it.position = p)
      }
    },

    keydown(e) {
      if (e.key === 'e' && this.entity) { // clockwise
        this.rotation = (this.rotation + 1) % 4
        ecs.removeEntity(this.entity)
        this.entity = ecs.newEntity(newModule(
          module,
          true,
          this.entity.position,
          this.rotation))
      } else if (e.key === 'q' && this.entity) { // anticlockwise
        this.rotation = (this.rotation - 1)
        if (this.rotation < 0) {
          this.rotation += 4
        }

        ecs.removeEntity(this.entity)
        this.entity = ecs.newEntity(newModule(
          module,
          true,
          this.entity.position,
          this.rotation))
      }
    }
  }
}

