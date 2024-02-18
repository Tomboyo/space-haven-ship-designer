export const GridRenderSystem = [
  "GridRenderSystem",
  ["canvas", "camera", "grid"],
  [],
  (canvas, camera, grid) => {
    let ctx = canvas.getContext("2d")
    let offsetX = camera.offsetX % grid.s
    let offsetY = camera.offsetY % grid.s
    // The number of squares is the minimum number to cover the screen + 1 to
    // slide in as the grid pans.
    var w = 1 + Math.ceil(canvas.width / grid.s)
    var h = 1 + Math.ceil(canvas.height / grid.s)

    ctx.save();
    ctx.beginPath()

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

    ctx.restore()
  }
]

