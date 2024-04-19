import Brush from './brush.js'

export default function panBrush(ecs) {
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
