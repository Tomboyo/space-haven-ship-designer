"use strict";

/*
 * ToDo: data and render loop with target FPS
 * see https://stackoverflow.com/a/48412686
 */


const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

const ecs = {
  resources: {},
  entities: [],
  systems: [],

  newResource(name, resource) {
    if (this.resources.hasOwnProperty(name))
      throw new Error(`Resource ${name} already exists`)
    this.resources[name] = resource
    return resource
  },

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

  /* args: [ [ name: String, resources: [string], components: [string], f: function arity resources.length + components.length ] ] => void */
  registerSystems(args) {
    args.forEach(([ name, resources, components, f ]) => {
      this.systems.push({ name, resources, components, f })
    })
  },

  run() {
    this.systems.forEach(({ name, resources: resourceSignature, components: componentSignature, f }) => {
      console.log(`Running system ${name}`)
      let resources = resourceSignature.map(name => this.resources[name])
      this.entities.forEach(({ components }) => {
	if (componentSignature.every(componentName => components.hasOwnProperty(componentName))) {
	  var components = componentSignature.map(componentName => components[componentName])
	  f(...resources, ...components)
	}
      })
    })
  },
}

const CanvasClearSystem = function() {
  console.log("Clearing canvas")
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

const GridRenderSystem = function(camera, grid) {
  console.log("Rendering grid:", grid)
  let offsetX = camera.offsetX % grid.s
  let offsetY = camera.offsetY % grid.s
  // The number of squares is the minimum number to cover the screen + 1 to
  // slide in as the grid pans.
  var w = 1 + Math.ceil(canvas.width / grid.s)
  var h = 1 + Math.ceil(canvas.height / grid.s)

  ctx.reset();

  // Render vertical grid lines
  for (let i = 0; i < w; i++) {
    var x = offsetX + (i * grid.s)
    ctx.moveTo(x, 0)
    ctx.lineTo(x, canvas.height)
  }

  // Render horizontal grid lines
  for (let i = 0; i < h; i++) {
    var y = offsetY + (i * grid.s)
    ctx.moveTo(0, y)
    ctx.lineTo(canvas.width, y)
  }

  ctx.strokeStyle = "#66ccff88"
  ctx.stroke()
}

const rem = () => parseInt(window.getComputedStyle(document.documentElement).fontSize)

const cameraResource = ecs.newResource("world", { offsetX: 0, offsetY: 0 })

const gridEntity = ecs.newEntity({ "grid": { s: rem() }})

ecs.registerSystems([
  ["CanvasClearSystem", [], [], CanvasClearSystem],
  ["GridRenderSystem", ["world"], ["grid"], GridRenderSystem]])


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

const pan = (e) => {
  if (e.buttons != 1) return
  cameraResource.offsetX += e.movementX
  cameraResource.offsetY += e.movementY
  ecs.run()
}

window.addEventListener('pointermove', pan)

resizeCanvas()

