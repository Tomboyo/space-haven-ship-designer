import { rem } from "./css.js"

const paintHullToggle = document.querySelector('#btn-draw-hull')
const eraseHullToggle = document.querySelector('#btn-erase-hull')

export const createInputManager = (canvas, cameraResource, gridResource, tilesResource, frameScheduler, ecs) => {
  return {
    pointer: {
      b0: false
    },
    selectionEntity: {
      paint: null,
      erase: null
    },
    isPaintHullToggleActive: false,
    isEraseHullToggleActive: false,
    
    onPaintHullToggle(e) {
      if (this.isPaintHullToggleActive) {
	this.isPaintHullToggleActive = false
	paintHullToggle.classList.remove('active')
      } else {
	this.isPaintHullToggleActive = true
	this.isEraseHullToggleActive = false
        paintHullToggle.classList.add('active')
	eraseHullToggle.classList.remove('active')
      }
    },

    onEraseHullToggle(e) {
      if (this.isEraseHullToggleActive) {
	this.isEraseHullToggleActive = false
	eraseHullToggle.classList.remove('active')
      } else {
	this.isPaintHullToggleActive = false
	this.isEraseHullToggleActive = true
	eraseHullToggle.classList.add('active')
	paintHullToggle.classList.remove('active')
      }
    },

    onPointerDown(e) {
      if (e.button === 0) {
	this.pointer.b0 = true

	if (this.isPaintHullToggleActive) {
	  this.beginSelection('paint', e)
	} else if (this.isEraseHullToggleActive) {
	  this.beginSelection('erase', e)
	}
      } else if (e.button === 2) {
	if (this.selectionEntity.paint) {
	  this.cancelSelection('paint')
	} else if (this.selectionEntity.erase) {
	  this.cancelSelection('erase')
	}
      }
    },

    onPointerMove(e) {
      if (this.pointer.b0) {
	if (this.selectionEntity['paint']) {
	  this.expandSelection('paint', e)
	} else if (this.selectionEntity['erase']) {
	  this.expandSelection('erase', e)
	} else {
	  this.panCamera(e)
	}
      }
    },

    onPointerUp(e) {
      if (e.button === 0) {
	this.pointer.b0 = false
	if (this.selectionEntity['paint']) {
	  this.commitSelection('paint', e, selection => this.drawHull(selection))
	} else if (this.selectionEntity['erase']) {
	  this.commitSelection('erase', e, selection => this.eraseHull(selection))
	}
      }
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

    beginSelection(name, e) {
      if (this.selectionEntity[name])
	throw new Error('Tried to create paintHullSelection but it already exists')

      let p = this.getTileCoordinates(e)
      this.selectionEntity[name] = ecs.newEntity({ 'selection': {p0: p, p1: p}})

      frameScheduler.requestFrame(() => ecs.run())
    },

    expandSelection(name, e) {
      this.selectionEntity[name].selection.p1 = this.getTileCoordinates(e)
      frameScheduler.requestFrame(() => ecs.run())
    },

    commitSelection(name, e, action) {
      ecs.removeEntity(this.selectionEntity[name])
      action(this.selectionEntity[name])
      this.selectionEntity[name] = null
      frameScheduler.requestFrame(() => ecs.run())
    },

    cancelSelection(name) {
      ecs.removeEntity(this.selectionEntity[name])
      this.selectionEntity[name] = null
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


