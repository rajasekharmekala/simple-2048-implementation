export class Direction {
    static Up = "up"
    static Down = "down"
    static Right = "right"
    static Left = "left"
  }
  
export class GameEvent {}

export class TileMergeEvent extends GameEvent {
  constructor(oldPosition, mergePosition, newValue) {
    super()
    this.oldPosition = oldPosition
    this.mergePosition = mergePosition
    this.newValue = newValue
  }
}

export class TileMoveEvent extends GameEvent {
  constructor(oldPosition, newPosition, value,shouldBeDeleted) {
    super()
    this.oldPosition = oldPosition
    this.newPosition = newPosition
    this.value = value
    this.shouldBeDeleted = shouldBeDeleted

  }
}

export class GameStartedEvent extends GameEvent {}

export class GameOverEvent extends GameEvent {}
