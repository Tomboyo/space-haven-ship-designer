export default [
  "GhostModuleSystem",
  ['canvas', 'camera', 'grid'],
  ['ghost', 'position'],
  (canvas, camera, grid, entities) => {
    let ctx = canvas.getContext('2d')
    ctx.save()
    // assuming we are rendering the X1 hyperdrive for now
    entities.forEach(([{border, fill}, {x: x0, y: y0}]) => {
      ctx.beginPath()
      ctx.strokeStyle = border
      ctx.fillStyle = fill

      let x = (x0 * grid.s) + camera.offsetX
      let y = (y0 * grid.s) + camera.offsetY
      ctx.rect(x, y, 4 * grid.s, 4 * grid.s)
      ctx.fillRect(x + grid.s, y, 2 * grid.s, 4 * grid.s)
      ctx.stroke();
    })
    ctx.restore()
  }
]
