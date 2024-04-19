import Brush from './brush.js'
import * as selection from './selection.js'

export default function(ecs, onCancel, onCommit) {
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

