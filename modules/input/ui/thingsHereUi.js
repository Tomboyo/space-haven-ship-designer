import { getTileCoordinates, rectContainsPoint } from '/modules/util.js'

import canvasUi from './canvasUi.js'

const ul = document.querySelector('#things-here-overlay-ul')
const nothing = li('Nothing.')

function install(ecs) {
  let hovered = []
  canvasUi.dom.canvas.addEventListener('mousemove', e => {
    let next = []
    ecs.entityQuery([], ['module'], ({module, position: {x, y}}) => {
      if (module.isGhost) return
      let {width, height} = module.boundingRect
      if (rectContainsPoint({x, y, width, height}, getTileCoordinates(e, ecs))) {
	next.push(module.name)
      }
    })

    if (next === hovered)
      return

    hovered = next
    if (hovered.length) {
      ul.replaceChildren(...hovered.map(li))
    } else {
      ul.replaceChildren(nothing)
    }
  })
}

function li(text) {
  let li = document.createElement('li')
  li.innerHTML = text
  return li
}

export default {
  install
}

