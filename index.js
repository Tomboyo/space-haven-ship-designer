"use strict";

const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
const widthInput = document.querySelector("#width")
const heightInput = document.querySelector("#height")

const ecs = {
  entities: [],
  systems: [],

  /* components: { string => obj } => Entity */
  newEntity(components) {
    var entity = { components, id: this.entities.length }
    this.entities.push(entity)
    return entity
  },

  /* Entity => void */
  removeEntity(e) {
    this.entities.splice(e.id, 1)
  },

  /* args: [ [ name: String, components: [string], f: function arity components.length ] ] => void */
  registerSystems(args) {
    args.forEach(([ name, components, f ]) => {
      this.systems.push({ name, components: [...components].sort(), f })
    })
  },

  run() {
    this.systems.forEach(({ name, components: signature, f }) => {
      console.log(`Running system ${name}`)
      this.entities.forEach(({ components }) => {
	if (signature.every(componentName => components.hasOwnProperty(componentName))) {
	  var components = signature.map(componentName => components[componentName])
	  f(...components)
	}
      })
    })
  },
}

const CanvasClearSystem = function() {
  console.log("Clearing canvas")
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

const GridRenderSystem = function({ offsetX, offsetY, s }) {
  console.log("Rendering grid")
  var w = 1 + Math.floor(canvas.width / s)
  var h = 1 + Math.floor(canvas.height / s)
  ctx.reset();

  // Render vertical grid lines
  for (let i = 0; i < w; i++) {
    var x = offsetX + (i * s)
    ctx.moveTo(x, 0)
    ctx.lineTo(x, canvas.height)
  }

  // Render horizontal grid lines
  for (let i = 0; i < h; i++) {
    var y = offsetY + (i * s)
    ctx.moveTo(0, y)
    ctx.lineTo(canvas.width, y)
  }

  ctx.strokeStyle = "black"
  ctx.stroke()
}

ecs.newEntity({
  "grid": {
    offsetX: 0,
    offsetY: 0,
    s: 10,
  }
})

ecs.registerSystems([
  ["CanvasClearSystem", [], CanvasClearSystem],
  ["GridRenderSystem", ["grid"], GridRenderSystem]])

ecs.run()

