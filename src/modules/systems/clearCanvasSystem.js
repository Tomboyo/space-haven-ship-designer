export const ClearCanvasSystem = [
  "ClearCanvasSystem",
  ["canvas"],
  [],
  (canvas) => {
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  },
];
