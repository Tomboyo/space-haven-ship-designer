/*
 * The editor is a composite of the canvas and each tab bar panel. The editor
 * governs transitions from one panel to another, and delegates most event
 * handling to the actual panels.
 *
 * Panels compose the canvas and a particular tab panel together. Each panel is
 * self-contained. For example, the paint panel doesn't know about the layout
 * panel.
 */

import * as css from '/modules/css.js'
import * as util from '/modules/util.js'

import * as paintPanelUi from './paintPanel.js'

const paintTab = document.querySelector('#paint-tab')
const layoutTab = document.querySelector('#layout-tab')

export function install(resources) {
  let editor = new Editor(paintTab)
  let a = [ paintTab, layoutTab ]
  a.forEach(it =>
    it.addEventListener('click', e => editor.changeActiveTab(e)))

  paintPanelUi.install(resources)
}

class Editor {
  constructor(activeTab) {
    this.activeTab = activeTab 
    this.activateTab(this.activeTab)
  }

  changeActiveTab(e) {
    if (e.target === this.activeTab) {
      return
    }

    this.deactivateTab(this.activeTab)
    this.activateTab(e.target)
    this.activeTab = e.target
  }

  activateTab(tab) {
    css.styleButtonActive(tab)
    css.styleButtonActive(this.panelForTab(tab))
  }

  deactivateTab(tab) {
    css.styleButtonInactive(tab)
    css.styleButtonInactive(this.panelForTab(tab))
  }

  panelForTab(target) {
    return document.querySelector('#' + target.getAttribute('data-tab-body-id'))
  }
}

