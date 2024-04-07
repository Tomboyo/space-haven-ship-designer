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

const paintTab = document.querySelector('#paint-tab')
const layoutTab = document.querySelector('#layout-tab')

export function install(resources) {
  let activeTab = paintTab
  activateTab(activeTab)

  let a = [ paintTab, layoutTab ]
  a.forEach(it =>
    it.addEventListener('click', e => activeTab = changeActiveTab(activeTab, e)))
}

function changeActiveTab(activeTab, e) {
  if (e.target === activeTab) {
    return activeTab
  }

  deactivateTab(activeTab)
  activateTab(e.target)
  return e.target
}

function activateTab(tab) {
  css.styleButtonActive(tab)
  css.styleButtonActive(panelForTab(tab))
}

function deactivateTab(tab) {
  css.styleButtonInactive(tab)
  css.styleButtonInactive(panelForTab(tab))
}

function panelForTab(target) {
  return document.querySelector('#' + target.getAttribute('data-tab-body-id'))
}
