import { modules } from '../component/modules.js'

const select = document.querySelector('#select-module-kind')
const carousel = document.querySelector('#modules-carousel')

function categoryId(category) {
  return category.toLowerCase().replaceAll(' ', '-')
}

export class ModulesCarousel {
  constructor(inputManager) {
    this.loadModules(inputManager)
    select.addEventListener('change', (e) => this.onSelectChange(e))
  }

  loadModules(inputManager) {
    modules
      .reduce((acc, el) => acc.add(el.category), new Set())
      .forEach(category => {
	let option = document.createElement('option')
	option.value = category
	option.innerHTML = category
	select.appendChild(option)

	let carouselShelf = document.createElement('div')
	carouselShelf.setAttribute('id', `carousel-shelf-${categoryId(category)}`)
	carouselShelf.classList.add('flex-button-row')
	carouselShelf.style.display = 'none'
	carousel.appendChild(carouselShelf)
      })

    modules.forEach(module => {
      let button = document.createElement('button')
      button.innerHTML = module.name
      button.addEventListener('click', (e) => inputManager.onPaintModuleToggleClick(e, module))
      document.querySelector(`#carousel-shelf-${categoryId(module.category)}`)
	.appendChild(button)
    })

    // Reveal one tab
    carousel.value = modules[0].category
    document.querySelector(`#carousel-shelf-${categoryId(carousel.value)}`).style.display = null
  }

  onSelectChange(e) {
    for (let child of carousel.children)
      child.style.display = 'none'
    document.querySelector(`#carousel-shelf-${categoryId(e.target.value)}`).style.display = null
  }
}
