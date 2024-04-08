import { styleButtonActive, styleButtonInactive } from '../css.js'
import { getTileCoordinates } from '../util.js'
import { newHullBlock } from '../component/hullBlock.js'

import { PanState } from './panState.js'
import { EraseHullInitialState } from './eraseHullStates.js'
import { PaintModuleInitialState } from './paintModuleStates.js'

export class PaintHullInitialState {
  constructor (manager) {
    this.manager = manager
  }

  onPaintHullToggleClick() {
    return new PanState(this.manager)
  }

  onEraseHullToggleClick() {
    styleButtonActive(this.manager.ui.eraseHullToggle)
    return new EraseHullInitialState(this.manager)
  }

  onPaintModuleToggleClick(e, module) {
    styleButtonActive(e.target)
    return new PaintModuleInitialState(this.manager, e, module)
  }
}

