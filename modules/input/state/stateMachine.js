import { PanState } from './panState.js'

export default class StateMachine {
  constructor(ecs, frameScheduler) {
    this.ecs = ecs
    this.frameScheduler = frameScheduler
    this.state = new PanState(ecs)
  }

  handle(which) {
    this.state = this.state[which]?.(...Array.prototype.slice.call(arguments, 1)) || this.state
    if (this.ecs.isDirty) {
      this.frameScheduler.requestFrame(() => this.ecs.run())
    }
  }
}

