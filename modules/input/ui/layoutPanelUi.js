const layoutSelect = document.querySelector("#layout-select")

function install(ecs, frameScheduler) {
  let gridResource = ecs.getResource('grid')
  let onLayoutChange = () => {
    let pair = layoutSelect.value.split("x")
    gridResource.w = Number.parseInt(pair[0])
    gridResource.h = Number.parseInt(pair[1])
    frameScheduler.requestFrame(() => ecs.run())
  }
  layoutSelect.addEventListener('change', onLayoutChange)
  onLayoutChange()
}

export default {
  install
}
