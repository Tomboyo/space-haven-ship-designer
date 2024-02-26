import { getTileCoordinates, rectContainsPoint } from '../util.js'

const ul = document.querySelector('#things-here-overlay-ul')
const nothing = li('Nothing.')

export class ThingsHereOverlay {
  constructor(canvas, ecs) {
    this.ecs = ecs
    this.hovered = []
    canvas.addEventListener('mousemove', e => this.onCanvasMouseMove(e))
  }

  onCanvasMouseMove(e) {
    let next = []
    this.ecs.entityQuery([], ['module'], ({module, position: {x, y}}) => {
      if (module.isGhost) return
      let {width, height} = module.boundingRect
      if (rectContainsPoint({x, y, width, height}, getTileCoordinates(e, this.ecs))) {
	next.push(module.name)
      }
    })

    if (next === this.hovered)
      return

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
