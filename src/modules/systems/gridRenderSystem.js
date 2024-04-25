export const GridRenderSystem = [
  "GridRenderSystem",
  ["canvas", "camera", "grid"],
  [],
  (canvas, camera, grid) => {
    let ctx = canvas.getContext("2d");
    let offsetX = camera.offsetX;
    let offsetY = camera.offsetY;

    ctx.save();
    ctx.beginPath();

    // Render vertical grid lines
    for (let i = 0; i <= grid.w; i++) {
      let x = offsetX + i * grid.s;
      ctx.moveTo(x, offsetY);
      ctx.lineTo(x, offsetY + grid.h * grid.s);
    }

    // Render horizontal grid lines
    for (let i = 0; i <= grid.h; i++) {
      let y = offsetY + i * grid.s;
      ctx.moveTo(offsetX, y);
      ctx.lineTo(offsetX + grid.w * grid.s, y);
    }

    ctx.strokeStyle = "#66ccff88";
    ctx.stroke();

    ctx.restore();
  },
];
