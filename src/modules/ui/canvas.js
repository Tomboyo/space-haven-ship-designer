import * as css from '../css.js'

const canvas = document.querySelector('canvas')

export function install({ ecs }) {
  window.addEventListener('resize', e => refitCanvas(ecs))
  
  canvas.addEventListener('wheel', e => {
    let amount = css.rem() * e.deltaY * -0.00075
    zoomCanvas(ecs, amount)
  })
}

export function refitCanvas(ecs) {
  ecs.updateResource('canvas', c => {
    let rect = c.parentNode.getBoundingClientRect()
    c.width = rect.width
    c.height = rect.height
  })
}

function zoomCanvas(ecs, amount) {
  ecs.updateResource('grid', g => g.s += amount)
}
