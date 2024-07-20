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

const colors = new Map([
  ["System", "#bb0000"],
  ["Airlock", "#bb6900"],
  ["Storage", "#0060bb"],
  ["Food", "#7800bb"],
  ["Resource", "#999300"],
  ["Power", "#fff600"],
  ["Life Support", "#7c3700"],
  ["Facility", "#0e316e"],
  ["Decorations", "#7c0045"],
  ["Furniture", "#ff8686"],
  ["Wall", "#5f5f5f"],
]);
const defaultColor = "ff11dd"; // Hot pink

export default [
  "ModuleSystem",
  ["canvas", "camera", "grid"],
  ["module", "position"],
  (canvas, camera, grid, entities) => {
    let ctx = canvas.getContext("2d");

    entities.forEach(([{ category, name, tiles, isGhost }, p]) => {
      Object.entries(tiles).forEach(([kind, rects]) => {
        switch (kind) {
          case "solid": {
            ctx.save();
            let color = colors.get(category) || defaultColor;
            ctx.fillStyle = isGhost ? color + "bb" : color;
            if (name.includes("Door")) {
              ctx.beginPath();
              rects.forEach((rect) => {
                ctx.roundRect(...rectArgs(p, rect, grid, camera), grid.s);
              });
              ctx.fill();
            } else {
              rects.forEach((rect) =>
                ctx.fillRect(...rectArgs(p, rect, grid, camera)),
              );
            }
            ctx.restore();
            break;
          }
          case "wall": {
            ctx.save();
            ctx.fillStyle = colors.get("Wall") + (isGhost ? "bb" : "");
            rects.forEach((rect) =>
              ctx.fillRect(...rectArgs(p, rect, grid, camera)),
            );
            ctx.restore();
            break;
          }
          case "striped": {
            ctx.save();
            let lw = grid.s / 5;
            ctx.lineWidth = lw;
            ctx.beginPath();
            rects.forEach((rect) =>
              ctx.rect(...insetRectArgs(p, rect, grid, camera, ctx.lineWidth)),
            );
            ctx.setLineDash([lw, lw]);
            ctx.strokeStyle = isGhost ? "#0008" : "#000";
            ctx.stroke();
            ctx.lineDashOffset = lw;
            ctx.strokeStyle = isGhost ? "#80850888" : "#808508";
            ctx.stroke();
            ctx.restore();
            break;
          }
          case "empty": {
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
          }
          case "clearance": {
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
          }
          default: {
            throw new Error(`Unexpected tile kind ${kind}`);
          }
        }
      });
    });
    ctx.restore();
  },
];
