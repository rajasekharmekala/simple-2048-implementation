
import {
  TileMergeEvent,
  TileMoveEvent,
  GameEvent,
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
    this.grid = new Grid(size)
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
    const gameEvents = []
    if (action.type === "MOVE") {
      gameEvents.push(...this.processMoveAction(action.direction))
    }
    if (action.type === "START") {

        gameEvents.push(new GameStartedEvent())
        for (let irow = 0; irow < this.grid.size; irow++) {
          for (let icell = 0; icell < this.grid.size; icell++) {
            if (this.grid.data[irow][icell] > 0) {
            //   gameEvents.push(
                // new TileDeletedEvent({ cellIndex: icell, rowIndex: irow })
            //   )
              this.grid.data[irow][icell] = 0
            }
          }
        }
        const newTile = this.insertNewTileToVacantSpace()
        if (newTile) {
        //   gameEvents.push(new TileCreatedEvent(newTile))
        }

    }
    return gameEvents
  }

  calculateMoveEvents(move) {
    const gameEvents = []
    const rowsData = this.grid.getRowDataByDirection(move)

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
        this.grid.updateTileByPos(event.newPosition, event.value)
        this.grid.clearTile(event.oldPosition.rowIndex,event.oldPosition.cellIndex )
      }

      if (event instanceof TileMergeEvent) {
        this.grid.updateTileByPos(event.mergePosition, event.newValue)
        this.grid.clearTile(event.oldPosition.rowIndex,event.oldPosition.cellIndex )
      }
    }

    // If we have events then there were some movements and therefore there must be some empty space to insert new tile
    if (anyTileMoved) {
      const newTile = this.insertNewTileToVacantSpace()
      if (!newTile) {
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

  insertNewTileToVacantSpace() {
    const emptyTiles = this.grid.availableCells()
    if (emptyTiles.length > 0) {
      const ti = this.getRandomInt(emptyTiles.length)
      const pos = emptyTiles[ti]
      const tile = {
        rowIndex: pos.rowIndex,
        cellIndex: pos.cellIndex,
        value: 2
      }
      this.grid.insertTile(pos.rowIndex, pos.cellIndex, 2)
      return tile
    }

    return undefined
  }
}
