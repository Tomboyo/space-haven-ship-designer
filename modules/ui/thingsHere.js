import * as util from '/modules/util.js'

const canvas = document.querySelector('#canvas')
const ul = document.querySelector('#things-here-overlay-ul')
const nothing = li('Nothing.')

export function install({ ecs }) {
  let hovered = []
  canvas.addEventListener('mousemove', e => {
    hovered = displayHoveredModule(ecs, hovered, e)
  })
}

function displayHoveredModule(ecs, hovered, e) {
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

    if (next === hovered) {
      return
    }

    if (hovered.length) {
      ul.replaceChildren(...hovered.map(li))
    } else {
      ul.replaceChildren(nothing)
    }

    return next
}

function li(text) {
  let li = document.createElement('li')
  li.innerHTML = text
  return li
}
