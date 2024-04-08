import { styleButtonActive } from '/modules/css.js'
import { PaintModuleInitialState } from './paintModuleStates.js'

export class DefaultState {
  constructor(manager) {
    this.manager = manager
  }

  onPaintModuleToggleClick(e, module) {
    styleButtonActive(e.target)
    return new PaintModuleInitialState(this.manager, e, module)
  }
}
