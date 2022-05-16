
import { Direction } from "./grid"

import { Grid } from "./grid"
import util from "./util"


export class Game {
  grid
  acQueue = []

  constructor(size) {
    this.size = size
    this.init()
  }

  init() {
    this.grid = new Grid(this.size)
    this.latestCell = null
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
      this.processMove(action.direction)
    }
    if (action.type === "START") {
      this.init()
      this.latestCell = this.addNewCell()
    }
  }

  getMoves(move) {
    let moves = []
    const rowsData = this.grid.groupRows(move)

    for (const row of rowsData) {
      const updates = util.updateCells(row)

      for (const update of updates) {
        const oldPosition = row[update.oldIndex]
        const newPosition = row[update.newIndex]
        moves.push({
          oldPosition,
          newPosition,
          value: update.isMerged ? update.mergedValue : update.value,
          shouldBeDeleted: update.isDeleted
        })
      }
    }

    return moves
  }

  processMove(move) {
    const moves = this.getMoves(move)

    for (const move of moves) {
      this.grid.updateCell(move.newPosition.rowIndex, move.newPosition.colIndex, move.value)
      this.grid.clearCell(move.oldPosition.rowIndex, move.oldPosition.colIndex)
    }

    if (moves.length >0) {
      this.latestCell = this.addNewCell()
      if (!this.latestCell) {
        alert("Cannot insert new cell!!!")
        throw new Error("Cannot insert new cell!!!")
      }
    } else {
      const availTitles = this.grid.availableCells()
      if (availTitles.length == 0) {

        const possibleMoves = this.getMoves(Direction.Up).length > 0 || this.getMoves(Direction.Right).length > 0 || this.getMoves(Direction.Left).length > 0 || this.getMoves(Direction.Down).length > 0
        return !possibleMoves? alert("Game Over!!! click reset") : null
      }
    }

  }

  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  addNewCell() {
    const emptyCells = this.grid.availableCells()
    if (emptyCells.length > 0) {
      const ti = this.getRandomInt(emptyCells.length)
      const pos = emptyCells[ti]
      const cell = {
        rowIndex: pos.rowIndex,
        colIndex: pos.colIndex,
        value: 2
      }
      this.grid.updateCell(pos.rowIndex, pos.colIndex, 2)
      return cell
    }

    return undefined
  }
}
