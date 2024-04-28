import * as util from "../../util.js";

import * as tool from "./tool.js";

export default class SelectionHandler {
  constructor(ecs, onCancel, onCommit) {
    this.ecs = ecs;
    this.onCancel = onCancel;
    this.onCommit = onCommit;
  }

  deactivate() {
    if (this.selection) {
      this.ecs.removeEntity(this.selection);
      this.selection = null;
    }
  }

  mousedown(e) {
    if (e.button === 0 && !this.selection) {
      this.selection = create(this.ecs, e);
    } else if (e.button === 2 && this.selection) {
      remove(this.ecs, this.selection);
      this.selection = null;
    } else if (e.button === 2) {
      this.onCancel();
    }
  }

  mouseup(e) {
    if (this.selection && e.button === 0) {
      this.onCommit(this.ecs, this.selection);
      remove(this.ecs, this.selection);
      this.selection = null;
    }
  }

  mousemove(e) {
    if (this.selection) {
      expand(this.ecs, this.selection, e);
    }
  }
}

function create(ecs, e) {
  let p = util.getTileCoordinates(e, ecs);
  return ecs.newEntity({ selection: { p0: p, p1: p } });
}

function expand(ecs, entity, e) {
  let p = util.getTileCoordinates(e, ecs);
  ecs.updateEntity(entity, (it) => (it.selection.p1 = p));
}

function remove(ecs, entity) {
  ecs.removeEntity(entity);
}
