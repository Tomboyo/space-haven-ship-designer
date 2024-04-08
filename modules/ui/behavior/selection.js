import * as util from '/modules/util.js'

export function create(ecs, e) {
  let p = util.getTileCoordinates(e, ecs)
  return ecs.newEntity({ 'selection': { p0: p, p1: p }})
}

export function expand(ecs, entity, e) {
  let p = util.getTileCoordinates(e, ecs)
  ecs.updateEntity(entity, it => it.selection.p1 = p)
}


export function remove(ecs, entity) {
  ecs.removeEntity(entity)
}
