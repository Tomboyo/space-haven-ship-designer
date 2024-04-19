import * as css from '../css.js'

export default class BrushButton {
  constructor(element, brush) {
    this.element = element
    this.brush = brush
  }

  activate() {
    css.styleButtonActive(this.element)
    this.brush.activate()
  }

  deactivate() {
    css.styleButtonInactive(this.element)
    this.brush.deactivate()
  }
}
