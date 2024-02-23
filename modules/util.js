export function getTileCoordinates(e, ecs) {
  let cameraResource = ecs.getResource('camera')
  let gridResource = ecs.getResource('grid')
  let canvasResource = ecs.getResource('canvas')
  /*
   * Some events may not have the canvas as their target, which changes
   * e.offsetX. We use getBoundingClientRect so that the actual position of the
   * canvas on the page is irrelevant.
   */
  let rect = canvasResource.getBoundingClientRect()
  let x = Math.floor((e.pageX - rect.left - cameraResource.offsetX) / gridResource.s)
  let y = Math.floor((e.pageY - rect.top - cameraResource.offsetY) / gridResource.s)
  return { x, y }
}

