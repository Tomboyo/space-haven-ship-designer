import * as util from '../util.js'

const canvas = document.querySelector('#canvas')
const ul = document.querySelector('#things-here-overlay-ul')
const nothing = li('Nothing.')

export function install({ ecs }) {
  let thingsHere = new ThingsHere([])
  ul.replaceChildren(nothing)
  canvas.addEventListener('mousemove', e => thingsHere.updateList(ecs, e))
}

class ThingsHere {
  constructor(hovered) {
    this.hovered = hovered
  }

  updateList(ecs, e) {
    let next = []
    ecs.entityQuery([], ['module'], ({module, position: {x, y}}) => {
      if (module.isGhost) {
        return
      }

      let {width, height} = module.boundingRect
      if (util.rectContainsPoint(
          {x, y, width, height},
          util.getTileCoordinates(e, ecs))) {
	next.push(module.name)
      }
    })

    if (next === this.hovered) {
      return
    }

    this.hovered = next

    if (this.hovered.length) {
      ul.replaceChildren(...this.hovered.map(li))
    } else {
      ul.replaceChildren(nothing)
    }
  }
}

function li(text) {
  let li = document.createElement('li')
  li.innerHTML = text
  return li
}
