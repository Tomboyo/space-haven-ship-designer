import { rem } from '/modules/css.js'
import { save } from '/modules/save.js'

const dom = {
  canvas: document.querySelector('#canvas')
}

function install(stateMachine, ecs) {
  dom.canvas.addEventListener('wheel', e => {
    ecs.updateResource('grid', g => {
      g.s += rem() * e.deltaY * -0.00075
    })
    stateMachine.handle('onCanvasWheel', e)
  })

  dom.canvas.addEventListener('mousedown', (e) => {
    if (e.button === 0) {
      stateMachine.handle('onCanvasLeftMouseDown', e)
    } else if (e.button === 2) {
      stateMachine.handle('onCanvasRightMouseDown', e)
    }
  })

  dom.canvas.addEventListener('mousemove', (e) => stateMachine.handle('onCanvasMouseMove', e))

  dom.canvas.addEventListener('mouseup', (e) => {
    if (e.button === 0) {
      stateMachine.handle('onCanvasLeftMouseUp', ...arguments)
    } else if (e.button === 2) {
      stateMachine.handle('onCanvasRightMouseUp', ...arguments)
    }

    /* Ensure this happens last so that save reflects all other changes */
    save(ecs)
  })
}

export default {
  dom,
  install
}
