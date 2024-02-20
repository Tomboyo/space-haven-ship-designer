import { rem } from "./css.js"

export const createInputManager = (canvas, cameraResource, gridResource, tilesResource, frameScheduler, ecs) => {
  return {
    isPaintHullToggleActive: false,
    paintHullSelection: null,
    
    onPaintHullToggle(e) {
      if (this.isPaintHullToggleActive) {
	this.isPaintHullToggleActive = false
	e.target.classList.remove('active')
      } else {
	this.isPaintHullToggleActive = true
	e.target.classList.add('active')
      }
    },

    onPointerDown(e) {
      if (!this.isPrimaryButtonPressed(e)) return
      if (this.isPaintHullToggleActive) {
	if (this.paintHullSelection)
	  throw new Error('Tried to create paintHullSelection but it already exists')
	let p = this.getTileCoordinates(e)
	this.paintHullSelection = ecs.newEntity({ 'selection': {p0: p, p1: p}})

	frameScheduler.requestFrame(() => ecs.run())
      }
    },

    onPointerMove(e) {
      if (!this.isPrimaryButtonPressed(e)) return

      if (this.paintHullSelection) {
	this.paintHullSelection.selection.p1 = this.getTileCoordinates(e)
      } else {
	this.panCamera(e)
      }

      frameScheduler.requestFrame(() => ecs.run())
    },

    onPointerUp(e) {
      if (!this.paintHullSelection) return
      if (this.isPrimaryButtonPressed(e)) return
      ecs.removeEntity(this.paintHullSelection)
      this.drawHull(this.paintHullSelection)
      this.paintHullSelection = null

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

    // e.buttons is an int bitmask (1 = primary, 2 = secondary, 4 = middle, etc)
    isPrimaryButtonPressed(e) { return e.buttons %2 === 1 },

    drawHull({ 'selection': {p0, p1}}) {
      let [x0, x1] = [p0.x, p1.x].sort()
      let [y0, y1] = [p0.y, p1.y].sort()

      for (let x = x0; x <= x1; x++) {
	tilesResource[x] ||= []
	for (let y = y0; y <= y1; y++) {
	  tilesResource[x][y] = ecs.newEntity(this.newHullBlock(x, y))
	}
      }
    },

    getTileCoordinates(e) {
      let x = Math.floor((e.offsetX - cameraResource.offsetX) / gridResource.s)
      let y = Math.floor((e.offsetY - cameraResource.offsetY) / gridResource.s)
      return { x, y }
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


