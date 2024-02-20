import { rem } from "./css.js"

export const createInputManager = (canvas, cameraResource, gridResource, tilesResource, frameScheduler, ecs) => {
  return {
    pointer: {
      b0: false,
      b2: false
    },
    isPaintHullToggleActive: false,
    paintHullSelection: null,
    eraseHullSelection: null,
    
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
      if (e.button === 0) this.pointer.b0 = true
      else if (e.button === 2) this.pointer.b2 = true

      if (e.button === 0) {
	if (this.isPaintHullToggleActive && this.eraseHullSelection) {
	  this.cancelEraseHullSelection(e)
	} else if (this.isPaintHullToggleActive) {
	  this.beginPaintHullSelection(e)
	}
      } else if (e.button === 2) {
	if (this.isPaintHullToggleActive && this.paintHullSelection) {
	  this.cancelPaintHullSelection()
	} else {
	  this.beginEraseHullSelection(e)
	}
      }
    },

    onPointerMove(e) {
      if (this.pointer.b0) {
	if (this.paintHullSelection) {
	  this.expandPaintHullSelection(e)
	} else {
	  this.panCamera(e)
	}
      } else if (this.pointer.b2) {
	if (this.eraseHullSelection) {
	  this.expandEraseHullSelection(e)
	}
      }
    },

    onPointerUp(e) {
      if (this.pointer.b0 && e.button === 0 && this.paintHullSelection) {
	this.commitPaintHullSelection(e)
      } else if (this.pointer.b2 && e.button === 2 && this.eraseHullSelection) {
	this.commitEraseHullSelection(e)
      }

      if (e.button === 0) this.pointer.b0 = false
      else if (e.button === 2) this.pointer.b2 = false
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

    beginPaintHullSelection(e) {
      if (this.paintHullSelection)
	throw new Error('Tried to create paintHullSelection but it already exists')

      let p = this.getTileCoordinates(e)
      this.paintHullSelection = ecs.newEntity({ 'selection': {p0: p, p1: p}})

      frameScheduler.requestFrame(() => ecs.run())
    },

    expandPaintHullSelection(e) {
      this.paintHullSelection.selection.p1 = this.getTileCoordinates(e)
      frameScheduler.requestFrame(() => ecs.run())
    },

    commitPaintHullSelection(e) {
      ecs.removeEntity(this.paintHullSelection)
      this.drawHull(this.paintHullSelection)
      this.paintHullSelection = null
      frameScheduler.requestFrame(() => ecs.run())
    },

    cancelPaintHullSelection() {
      ecs.removeEntity(this.paintHullSelection)
      this.paintHullSelection = null
      frameScheduler.requestFrame(() => ecs.run())
    },

    beginEraseHullSelection(e) {
      if (this.eraseHullSelection)
	throw new Error('Tried to create eraseHullSelection but it already exists')

      let p = this.getTileCoordinates(e)
      this.eraseHullSelection = ecs.newEntity({ 'selection': {p0: p, p1: p}})

      frameScheduler.requestFrame(() => ecs.run())
    },

    expandEraseHullSelection(e) {
      this.eraseHullSelection.selection.p1 = this.getTileCoordinates(e)
      frameScheduler.requestFrame(() => ecs.run())
    },

    commitEraseHullSelection(e) {
      ecs.removeEntity(this.eraseHullSelection)
      this.eraseHull(this.eraseHullSelection)
      this.eraseHullSelection = null
      frameScheduler.requestFrame(() => ecs.run())
    },

    cancelEraseHullSelection() {
      ecs.removeEntity(this.eraseHullSelection)
      this.eraseHullSelection = null
      frameScheduler.requestFrame(() => ecs.run())
    },

    drawHull({ 'selection': {p0, p1}}) {
      let [x0, x1] = p0.x < p1.x ? [p0.x, p1.x] : [p1.x, p0.x]
      let [y0, y1] = p0.y < p1.y ? [p0.y, p1.y] : [p1.y, p0.y]

      for (let x = x0; x <= x1; x++) {
	tilesResource[x] ||= []
	for (let y = y0; y <= y1; y++) {
	  if (tilesResource[x][y]) continue
	  tilesResource[x][y] = ecs.newEntity(this.newHullBlock(x, y))
	}
      }
    },

    eraseHull({ 'selection': {p0, p1}}) {
      let [x0, x1] = p0.x < p1.x ? [p0.x, p1.x] : [p1.x, p0.x]
      let [y0, y1] = p0.y < p1.y ? [p0.y, p1.y] : [p1.y, p0.y]

      for (let x = x0; x <= x1; x++) {
	if (!tilesResource[x]) continue
	for (let y = y0; y <= y1; y++) {
	  let entity = tilesResource[x][y]
	  if (!entity) continue
	  ecs.removeEntity(entity)
	  tilesResource[x][y] = null
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
      frameScheduler.requestFrame(() => ecs.run())
    },
  }
}


