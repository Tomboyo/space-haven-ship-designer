const layoutSelect = document.querySelector("#layout-select")

export function install({ ecs }) {
  let onSelect = () => {
    let pair = layoutSelect.value.split("x")
    ecs.updateResource('grid', it => {
      it.w = Number.parseInt(pair[0])
      it.h = Number.parseInt(pair[1])
    })
  }

  layoutSelect.addEventListener('change', onSelect)


  onSelect()
}

