import { clearSaveData } from '/modules/save.js'

import modulesCarouselUi from './modulesCarouselUi.js'

const dom = {
  paintHullToggle: document.querySelector('#btn-paint-hull'),
  eraseToggle: document.querySelector('#btn-erase'),
  clearAllButton: document.querySelector('#btn-clear-all'),
  moduleCarouselSelect: document.querySelector('#select-module-kind'),
  moduleCarousel: document.querySelector('#modules-carousel')
}

function install(stateMachine, ecs) {
  modulesCarouselUi.install(stateMachine)
  dom.paintHullToggle.addEventListener('click', (e) => stateMachine.handle('onPaintHullToggleClick', e))
  dom.eraseToggle.addEventListener('click', (e) => stateMachine.handle('onEraseHullToggleClick', e))
  dom.clearAllButton.addEventListener('click', (e) => clearSaveData(ecs))
}

export default {
  dom,
  install
}
