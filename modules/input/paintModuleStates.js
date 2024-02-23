import { styleButtonActive, styleButtonInactive } from '../css.js'

import { PaintHullInitialState } from './paintHullStates.js'
import { EraseHullInitialState } from './eraseHullStates.js'
import { PanState } from './panState.js'

export class PaintModuleInitialState {
  constructor(manager) {
    this.manager = manager
  }

  onPaintHullToggleClick() {
    styleButtonInactive(this.manager.ui.paintModuleToggle)
    styleButtonActive(this.manager.ui.paintHullToggle)
    return new PaintHullInitialState(this.manager)
  }

  onEraseHullToggleClick() {
    styleButtonInactive(this.manager.ui.paintModuleToggle)
    styleButtonActive(this.manager.ui.eraseHullToggle)
    return new EraseHullInitialState(this.manager)
  }

  onPaintModuleToggleClick() {
    styleButtonInactive(this.manager.ui.paintModuleToggle)
    return new PanState(this.manager)
  }
}
