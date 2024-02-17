"use strict";

/*
 * ToDo: data and render loop with target FPS
 * see https://stackoverflow.com/a/48412686
 */


const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

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

const GridRenderSystem = function(grid) {
  console.log("Rendering grid:", grid)

  const { offsetX, offsetY, s } = grid
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

  ctx.strokeStyle = "#66ccff88"
  ctx.stroke()
}

const rem = () => parseInt(window.getComputedStyle(document.documentElement).fontSize)

const gridEntity = ecs.newEntity({
  "grid": {
    offsetX: 0,
    offsetY: 0,
    s: rem(),
  }
})

ecs.registerSystems([
  ["CanvasClearSystem", [], CanvasClearSystem],
  ["GridRenderSystem", ["grid"], GridRenderSystem]])


const resizeCanvas = () => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  ecs.run()
}

window.addEventListener('resize', resizeCanvas)

const zoom = (e) => {
  gridEntity.components.grid.s += rem() * e.deltaY * -0.00075
  ecs.run()
}

window.addEventListener('wheel', zoom)

resizeCanvas()

