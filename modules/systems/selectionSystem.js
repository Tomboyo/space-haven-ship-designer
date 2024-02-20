export default [
  'SelectionSystem',
  ['canvas', 'camera', 'grid'],
  ['selection'],
  (canvas, camera, grid, entities) => {
    let ctx = canvas.getContext('2d')
    ctx.save()
    ctx.fillStyle = '#66ccff44'
    entities.forEach(([{p0, p1}]) => {
      let [x0, x1] = [p0.x, p1.x].sort()
      let [y0, y1] = [p0.y, p1.y].sort()
      ctx.fillRect(
	x0 * grid.s + camera.offsetX,
	y0 * grid.s + camera.offsetY,
	(x1 - x0 + 1) * grid.s,
	(y1 - y0 + 1) * grid.s)
    })
    ctx.restore()
  }
]
