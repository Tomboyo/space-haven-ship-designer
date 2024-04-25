export const TileRenderSystem = [
  "TileRenderSystem",
  ["canvas", "grid", "camera"],
  ["position", "tile"],
  (canvas, grid, camera, entities) => {
    let ctx = canvas.getContext("2d");
    ctx.save();
    ctx.beginPath();
    entities.forEach(([p, { color }]) => {
      let x = p.x * grid.s + camera.offsetX;
      let y = p.y * grid.s + camera.offsetY;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, grid.s, grid.s);
    });
    ctx.restore();
  },
];
