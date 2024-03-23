function install(uiStateMachine, ecs) {
  window.addEventListener('keydown', e => uiStateMachine.handle('onKeyDown', e))

  let onResize = (e) => {
    ecs.updateResource('canvas', c => {
      let rect = c.parentNode.getBoundingClientRect()
      c.width = rect.width
      c.height = rect.height
    })
    uiStateMachine.handle('onResize', e)
  }

  window.addEventListener('resize', onResize)
  onResize()
}

export default {
  install
}

