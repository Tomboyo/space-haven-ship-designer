import { rem } from "./css.js"

export const createInputManager = (canvas, cameraResource, gridResource, tilesResource, frameScheduler, ecs) => {
  return {
    isPaintHullToggleActive: false,
    
    onPaintHullToggle(e) {
      if (this.isPaintHullToggleActive) {
	this.isPaintHullToggleActive = false
	e.target.classList.remove('active')
      } else {
	this.isPaintHullToggleActive = true
	e.target.classList.add('active')
      }
    },

    onPointerMove(e) {
      // e.buttons is an int bitmask (1 = primary, 2 = secondary, 4 = middle, etc)
      if (e.buttons %2 !== 1) return

      if (this.isPaintHullToggleActive) {
	this.drawHull(e)
      } else {
	this.panCamera(e)
      }

      frameScheduler.requestFrame(() => ecs.run())
    },

    onResize(_e) {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      frameScheduler.requestFrame(() => ecs.run())
    },

    onWheel(e) {
      gridResource.s += rem() * e.deltaY * -0.00075
      frameScheduler.requestFrame(() => ecs.run())
    },

    drawHull(e) {
      let x = Math.floor((e.offsetX - cameraResource.offsetX) / gridResource.s)
      let y = Math.floor((e.offsetY - cameraResource.offsetY) / gridResource.s)
      tilesResource[x] ||= []
      if (!tilesResource[x][y]) {
	tilesResource[x][y] = ecs.newEntity(this.newHullBlock(x, y));
      }
    },

    newHullBlock(x, y) {
      return {
	"position": { x, y },
	"tile": { color: "gray" }
      }
    },

    panCamera(e) {
      cameraResource.offsetX += e.movementX
      cameraResource.offsetY += e.movementY
    },
  }
}


