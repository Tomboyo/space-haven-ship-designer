import Brush from './brush.js'
import * as selection from './selection.js'

export default function(ecs, onCancel, onCommit) {
  return new Brush({
    deactivate() {
      if (this.selection) {
        ecs.removeEntity(this.selection)
        this.selection = null
      }
    },

    mousedown(e) {
      if (e.button === 0 && !this.selection) {
        this.selection = selection.create(ecs, e)
      } else if (e.button === 2 && this.selection) {
        selection.remove(ecs, this.selection)
        this.selection = null
      } else if (e.button === 2) {
        onCancel()
      }
    },

    mouseup(e) {
      if (this.selection && e.button === 0) {
        onCommit(ecs, this.selection)
        selection.remove(ecs, this.selection)
        this.selection = null
      }
    },

    mousemove(e) {
      if (this.selection) {
        selection.expand(ecs, this.selection, e)
      }
    }
  })
}

