import { modules } from '../component/modules.js'

export default [
  "ModuleSystem",
  ['canvas', 'camera', 'grid'],
  ['module', 'position'],
  (canvas, camera, grid, entities) => {
    let ctx = canvas.getContext('2d')

    entities.forEach(([{category, name, isGhost}, {x: x0, y: y0}]) => {
      
      let proto = modules[category][name]
      Object.keys(proto).forEach(kind => {
	switch (kind) {
	  case 'solid':
	    ctx.save()
	    ctx.fillStyle = isGhost ? '#0e6e1dbb' : '#0e6e1d'
	    proto[kind].forEach(box => ctx.fillRect(
	      (x0 + (box.offsetX || 0)) * grid.s + camera.offsetX,
	      (y0 + (box.offsetY || 0)) * grid.s + camera.offsetY,
	      box.width * grid.s,
	      box.height * grid.s))
	    ctx.restore()
	    break
	  case 'wall':
	    ctx.save()
	    ctx.fillStyle = isGhost ? '#0e316ebb' : '#0e316e'
	    proto[kind].forEach(box => ctx.fillRect(
	      (x0 + (box.offsetX || 0)) * grid.s + camera.offsetX,
	      (y0 + (box.offsetY || 0)) * grid.s + camera.offsetY,
	      box.width * grid.s,
	      box.height * grid.s))
	    ctx.restore()
	    break
	  case 'striped':
	    ctx.save()
	    ctx.lineWidth = grid.s / 5
	    ctx.beginPath()
	    proto[kind].forEach(box => {
	      ctx.rect(
		(x0 + (box.offsetX || 0)) * grid.s + camera.offsetX + (ctx.lineWidth / 2),
		(y0 + (box.offsetY || 0)) * grid.s + camera.offsetY + (ctx.lineWidth / 2),
		box.width * grid.s - ctx.lineWidth,
		box.height * grid.s - ctx.lineWidth)
	    })
	    ctx.setLineDash([grid.s / 5, grid.s / 5])
	    ctx.strokeStyle = isGhost ? '#0008' : '#000'
	    ctx.stroke()
	    ctx.lineDashOffset = grid.s / 5
	    ctx.strokeStyle = isGhost ? '#80850888' : '#808508'
	    ctx.stroke()
	    ctx.restore()
	    break
	  case 'empty':
	    ctx.save()
	    ctx.beginPath()
	    ctx.setLineDash([grid.s / 5, grid.s / 5])
	    ctx.lineWidth = grid.s / 7
	    ctx.strokeStyle = isGhost ? '#aaa8' : '#aaa'
	    proto[kind].forEach(box =>
	      ctx.rect(
		(x0 + (box.offsetX || 0)) * grid.s + camera.offsetX + (ctx.lineWidth / 2),
		(y0 + (box.offsetY || 0)) * grid.s + camera.offsetY + (ctx.lineWidth / 2),
		box.width * grid.s - ctx.lineWidth,
		box.height * grid.s - ctx.lineWidth))
	    ctx.stroke()
	    ctx.restore()
	    break
	  case 'clearance':
	    ctx.save()
	    ctx.lineWidth = grid.s / 5
	    ctx.beginPath()
	    proto[kind].forEach(box =>
	      ctx.rect(
		(x0 + (box.offsetX || 0)) * grid.s + camera.offsetX + (ctx.lineWidth / 2),
		(y0 + (box.offsetY || 0)) * grid.s + camera.offsetY + (ctx.lineWidth / 2),
		box.width * grid.s - ctx.lineWidth,
		box.height * grid.s - ctx.lineWidth))
	    ctx.strokeStyle = isGhost ? '#69030388' : '#690303'
	    ctx.setLineDash([grid.s / 5, grid.s / 5])
	    ctx.stroke()
	    ctx.restore()
	    break
	  default:
	    throw new Error(`Unexpected tile kind ${kind}`)
	}
      })
    })
    ctx.restore()
  }
]
