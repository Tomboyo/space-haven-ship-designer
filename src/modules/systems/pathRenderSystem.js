export default [
  "PathRenderSystem",
  ["canvas", "tiles", "grid", "camera"],
  ["path"],
  (canvas, tiles, grid, camera, entities) => {
    let ctx = canvas.getContext("2d");
    ctx.save();
    ctx.strokeStyle = "red";
    entities.forEach(([path]) => {
      ctx.beginPath();
      ctx.moveTo(
        path[0][0] * grid.s + grid.s / 2 + camera.offsetX,
        path[0][1] * grid.s + grid.s / 2 + camera.offsetY,
      );
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(
          path[i][0] * grid.s + grid.s / 2 + camera.offsetX,
          path[i][1] * grid.s + grid.s / 2 + camera.offsetY,
        );
      }
      ctx.stroke();
    });
    ctx.restore();
  },
];
