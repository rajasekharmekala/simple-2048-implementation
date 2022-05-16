
import {
  TileMergeEvent,
  TileMoveEvent,
  GameOverEvent,
  GameStartedEvent,
  Direction
} from "./events"

import { Grid } from "./grid"
import { RowProcessor } from "./row_processor"


export class Game {
  grid
  acQueue = []

  constructor(size) {
    this.size = size  
    this.init()
  }

  init(){
    this.grid = new Grid(this.size)
    this.latestTile = null
  }


  queueAction(action) {
    this.acQueue.push(action)
  }

  async run() {
    while (this.acQueue.length === 0) {
        await new Promise(r => setTimeout(r, 100))
    }

    const action = this.acQueue.splice(0, 1)[0]
    return this.processAction(action)
  }

  processAction(action) {
    if (action.type === "MOVE") {
      this.processMoveAction(action.direction)
    }
    if (action.type === "START") {
        this.init()
        this.latestTile = this.addNewCell()
    }
  }

  calculateMoveEvents(move) {
    const gameEvents = []
    const rowsData = this.grid.groupRows(move)

    for (const row of rowsData) {
      const rowEvents = RowProcessor.ProcessRow(row)

      //apply row events to game grid and publish them to subscribers
      for (const rowEvent of rowEvents) {
        const oldPos = row[rowEvent.oldIndex]
        const newPos = row[rowEvent.newIndex]
        if (rowEvent.isMerged) {
          gameEvents.push(
            new TileMergeEvent(oldPos, newPos, rowEvent.mergedValue)
          )
        } else {
          gameEvents.push(
            new TileMoveEvent(
              oldPos,
              newPos,
              rowEvent.value,
              rowEvent.isDeleted
            )
          )
        }
      }
    }

    return gameEvents
  }

  processMoveAction(move) {
    const gameEvents = this.calculateMoveEvents(move)

    const anyTileMoved = gameEvents.length > 0

    for (const event of gameEvents) {
      if (event instanceof TileMoveEvent) {
        this.grid.updateCell(event.newPosition.rowIndex, event.newPosition.colIndex, event.value)
        this.grid.clearTile(event.oldPosition.rowIndex,event.oldPosition.colIndex )
      }

      if (event instanceof TileMergeEvent) {
        this.grid.updateCell(event.mergePosition.rowIndex, event.mergePosition.colIndex, event.newValue)
        this.grid.clearTile(event.oldPosition.rowIndex,event.oldPosition.colIndex )
      }
    }

    // If we have events then there were some movements and therefore there must be some empty space to insert new tile
    if (anyTileMoved) {
      this.latestTile = this.addNewCell()
      if (!this.latestTile) {
        throw new Error("New title must be inserted somewhere!")
      }
    //   gameEvents.push(new TileCreatedEvent(newTile))
    } else {
    //   gameEvents.push(new TilesNotMovedEvent(move))

      // Here we need to check if game grid is full - so might be game is finished if there is no possibility to make a movement
      const availTitles = this.grid.availableCells()
      if (availTitles.length == 0) {
        // Check if there are possible movements
        const weHaveSomePossibleEvents =
          this.calculateMoveEvents(Direction.Up).length > 0 ||
          this.calculateMoveEvents(Direction.Right).length > 0 ||
          this.calculateMoveEvents(Direction.Left).length > 0 ||
          this.calculateMoveEvents(Direction.Down).length > 0
        if (!weHaveSomePossibleEvents) {
          alert("Game Over!!! click reset")
          // Game is over, dude
          gameEvents.push(new GameOverEvent())
        }
      }
    }

    return gameEvents
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  addNewCell() {
    const emptyTiles = this.grid.availableCells()
    if (emptyTiles.length > 0) {
      const ti = this.getRandomInt(emptyTiles.length)
      const pos = emptyTiles[ti]
      const tile = {
        rowIndex: pos.rowIndex,
        colIndex: pos.colIndex,
        value: 2
      }
      this.grid.updateCell(pos.rowIndex, pos.colIndex, 2)
      return tile
    }

    return undefined
  }
}
