import selectionBrush from './selectionBrush.js'

export default function(ecs, cancel) {
  return selectionBrush(ecs, cancel, erase)
}

function erase(ecs, entity, e) {
  let p0 = entity.selection.p0
  let p1 = entity.selection.p1
  let [x0, x1] = p0.x < p1.x ? [p0.x, p1.x] : [p1.x, p0.x]
  let [y0, y1] = p0.y < p1.y ? [p0.y, p1.y] : [p1.y, p0.y]
  let tilesResource = ecs.getResource('tiles')

  ecs.entityQuery(
    ['tiles'],
    ['id', 'position', 'tile'],
    (tiles, {id, position: {x, y}}, buffer) => {
      if (x0 <= x && x <= x1 && y0 <= y && y <= y1) {
        buffer.removeEntity(id)
        if (tiles[x]) delete tiles[x][y]
      }
    })

  ecs.entityQuery(
    [],
    ['id', 'position', 'module'],
    ({id, position: {x, y}, module: {tiles}}, buffer) => {
      /* Note: not checking isGhost because there shouldn't be any during erase, and
       * if there are, the user may as well have a way to remove them. */
      let intersection = Object.values(tiles).flat().find(rect => {
        let bx0 = x + rect.offsetX
        let bx1 = x + rect.offsetX + rect.width - 1
        let by0 = y + rect.offsetY
        let by1 = y + rect.offsetY+ rect.height - 1
        return x0 <= bx1 && x1 >= bx0 && y0 <= by1 && y1 >= by0
      })
      if (intersection) {
        buffer.removeEntity(id)
      }
    })
}
