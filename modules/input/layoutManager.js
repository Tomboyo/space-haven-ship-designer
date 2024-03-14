const layoutSelect = document.querySelector("#layout-select")

export class LayoutManager {
  constructor(gridResource, ecs, frameScheduler) {
    this.gridResource = gridResource
    this.ecs = ecs
    this.frameScheduler = frameScheduler

    layoutSelect.addEventListener('change', (e) => this.onLayoutChange())
  }

  onLayoutChange() {
    let pair = layoutSelect.value.split("x")
    this.gridResource.w = Number.parseInt(pair[0])
    this.gridResource.h = Number.parseInt(pair[1])
    this.frameScheduler.requestFrame(() => this.ecs.run())
  }
}
