function rectArgs({ x, y }, rect, grid, camera) {
  return [
    (x + rect.offsetX) * grid.s + camera.offsetX,
    (y + rect.offsetY) * grid.s + camera.offsetY,
    rect.width * grid.s,
    rect.height * grid.s,
  ];
}

function insetRectArgs({ x, y }, rect, grid, camera, lineWidth) {
  return [
    (x + rect.offsetX) * grid.s + camera.offsetX + lineWidth / 2,
    (y + rect.offsetY) * grid.s + camera.offsetY + lineWidth / 2,
    rect.width * grid.s - lineWidth,
    rect.height * grid.s - lineWidth,
  ];
}

export default [
  "ModuleSystem",
  ["canvas", "camera", "grid"],
  ["module", "position"],
  (canvas, camera, grid, entities) => {
    let ctx = canvas.getContext("2d");

    entities.forEach(([{ tiles, isGhost }, p]) => {
      Object.entries(tiles).forEach(([kind, rects]) => {
        switch (kind) {
          case "solid":
            ctx.save();
            ctx.fillStyle = isGhost ? "#0e6e1dbb" : "#0e6e1d";
            rects.forEach((rect) =>
              ctx.fillRect(...rectArgs(p, rect, grid, camera)),
            );
            ctx.restore();
            break;
          case "wall":
            ctx.save();
            ctx.fillStyle = isGhost ? "#0e316ebb" : "#0e316e";
            rects.forEach((rect) =>
              ctx.fillRect(...rectArgs(p, rect, grid, camera)),
            );
            ctx.restore();
            break;
          case "striped":
            ctx.save();
            let m = grid.s / 5;
            ctx.lineWidth = grid.s / 5;
            ctx.beginPath();
            rects.forEach((rect) =>
              ctx.rect(...insetRectArgs(p, rect, grid, camera, ctx.lineWidth)),
            );
            ctx.setLineDash([grid.s / 5, grid.s / 5]);
            ctx.strokeStyle = isGhost ? "#0008" : "#000";
            ctx.stroke();
            ctx.lineDashOffset = grid.s / 5;
            ctx.strokeStyle = isGhost ? "#80850888" : "#808508";
            ctx.stroke();
            ctx.restore();
            break;
          case "empty":
            ctx.save();
            ctx.beginPath();
            ctx.setLineDash([grid.s / 5, grid.s / 5]);
            ctx.lineWidth = grid.s / 7;
            ctx.strokeStyle = isGhost ? "#aaa8" : "#aaa";
            rects.forEach((rect) =>
              ctx.rect(...insetRectArgs(p, rect, grid, camera, ctx.lineWidth)),
            );
            ctx.stroke();
            ctx.restore();
            break;
          case "clearance":
            ctx.save();
            ctx.lineWidth = grid.s / 5;
            ctx.beginPath();
            rects.forEach((rect) =>
              ctx.rect(...insetRectArgs(p, rect, grid, camera, ctx.lineWidth)),
            );
            ctx.strokeStyle = isGhost ? "#69030388" : "#690303";
            ctx.setLineDash([grid.s / 5, grid.s / 5]);
            ctx.stroke();
            ctx.restore();
            break;
          default:
            throw new Error(`Unexpected tile kind ${kind}`);
        }
      });
    });
    ctx.restore();
  },
];
