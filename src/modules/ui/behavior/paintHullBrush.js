import * as util from '../../util.js'
import * as hullBlocks from '../../component/hullBlock.js'

import selectionBrush from './selectionBrush.js'

export default function(ecs, cancel) {
  return selectionBrush(ecs, cancel, paintHull)
}

function paintHull(ecs, entity) {
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
}

