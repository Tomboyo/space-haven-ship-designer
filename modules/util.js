export function getTileCoordinates(e, ecs) {
  let cameraResource = ecs.getResource('camera')
  let gridResource = ecs.getResource('grid')
  let x = Math.floor((e.offsetX - cameraResource.offsetX) / gridResource.s)
  let y = Math.floor((e.offsetY - cameraResource.offsetY) / gridResource.s)
  return { x, y }
}

