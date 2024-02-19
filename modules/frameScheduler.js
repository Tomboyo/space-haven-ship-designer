export default {
  requestId: null,
  requestFrame(f) {
    if (!(f instanceof Function))
      throw new Error("f is not a function")

    if (this.requestId !== null) return

    this.requestId = window.requestAnimationFrame(() => {
      this.requestId = null
      f()
    })
  }
}

