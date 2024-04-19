export default class Brush {
  constructor(strategy) {
    let { mousedown, mouseup, mousemove, keydown } = strategy
    this.mousedown = mousedown?.bind(strategy)
    this.mouseup = mouseup?.bind(strategy)
    this.mousemove = mousemove?.bind(strategy)
    this.keydown = keydown?.bind(strategy)
  }

  activate() {
    this.mousedown && canvas.addEventListener('mousedown', this.mousedown)
    this.mouseup && canvas.addEventListener('mouseup', this.mouseup)
    this.mousemove && canvas.addEventListener('mousemove', this.mousemove)
    this.keydown && window.addEventListener('keydown', this.keydown)
  }

  deactivate() {
    this.mousedown && canvas.removeEventListener('mousedown', this.mousedown)
    this.mouseup && canvas.removeEventListener('mouseup', this.mouseup)
    this.mousemove && canvas.removeEventListener('mousemove', this.mousemove)
    this.keydown && window.removeEventListener('keydown', this.keydown)
  }
}
