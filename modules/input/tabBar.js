export function initializeTabBar() {
  let buttons = document.querySelectorAll("#tab-panel .tab-header")
  let panels = document.querySelectorAll("#tab-panel .tab-body")
  buttons.forEach(button => {
    let panelId = button.getAttribute("data-tab-id")
    let panel = document.querySelector(`#${panelId}`)
    button.addEventListener('click', e => {
      buttons.forEach(b => b.classList.remove('active'))
      panels.forEach(p => p.classList.remove('active'))
      button.classList.add('active')
      panel.classList.add('active')
    })
  })
}

