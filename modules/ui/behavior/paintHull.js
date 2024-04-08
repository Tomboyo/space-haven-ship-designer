import * as util from '/modules/util.js'
import * as hullBlocks from '/modules/component/hullBlock.js'

export function startPaintHullSelection(ecs, e) {
  let p = util.getTileCoordinates(e, ecs)
  return ecs.newEntity({ 'selection': {p0: p, p1: p} })
}

export function updatePaintHullSelection(ecs, entity, e) {
  let p = util.getTileCoordinates(e, ecs)
  ecs.updateEntity(entity, it => it.selection.p1 = p)
}

export function commitPaintHullSelection(ecs, entity, e) {
  let p0 = entity.selection.p0
  let p1 = entity.selection.p1
  let [x0, x1] = p0.x < p1.x ? [p0.x, p1.x] : [p1.x, p0.x]
  let [y0, y1] = p0.y < p1.y ? [p0.y, p1.y] : [p1.y, p0.y]
  
  ecs.updateResource('tiles', tiles => {
    for (let x = x0; x <= x1; x++) {
      tiles[x] ||= []
      for (let y = y0; y <= y1; y++) {
        if (tiles[x][y]) {
          continue
        }

        ecs.newEntity(hullBlocks.newHullBlock(x, y))
        tiles[x][y] = true
      }
    }
  })

  ecs.removeEntity(entity)
}

export function cancelPaintHullSelection(ecs, entity) {
  ecs.removeEntity(entity)
}
