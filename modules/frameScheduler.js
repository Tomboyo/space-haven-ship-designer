export default createFrameSheduler = (action) => {
  requestId: null,
  action,
  requestFrame() => {
    if (this.requestId !== null) return
    this.requestId = window.requestAnimationFrame(() => {
      this.requesetId = null
      action()
    })
  }
}
