import * as css from '/modules/css.js'

import { modules } from '/modules/component/modules.js'

import paintModuleBrush from './behavior/paintModuleBrush.js'
import panBrush from './behavior/panBrush.js'
import paintHullBrush from './behavior/paintHullBrush.js'
import eraseBrush  from './behavior/eraseBrush.js'

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
      new BrushButton(paintHullToggle, paintHullBrush(ecs, cancel)),
      new BrushButton(eraseToggle, eraseBrush(ecs, cancel)),
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
  return new BrushButton(button, paintModuleBrush(ecs, module, onCancel))
}

