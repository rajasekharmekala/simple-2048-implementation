import { Direction } from "./events"


export class Grid {
    size
    data
  
    constructor(size) {
      this.size = size
      this.data = new Array(this.size)
      for (let irow = 0; irow < this.size; irow++) {
        this.data[irow] = new Array(this.size).fill(0)
      }
    }
  
    insertTile(irow, icell, value) {
        if(irow >=0 && irow<this.size && icell >=0 && icell < this.size && this.data[irow][icell] == 0){
            this.data[irow][icell] = value
        }else{
            throw new Error("Invalid cell")
        }
    }
  
    clearTile(irow, icell) {
      this.data[irow][icell] = 0
    }
  
    getTile(irow, icell) {
      return {
        rowIndex: irow,
        cellIndex: icell,
        value: this.data[irow][icell]
      }
    }
  
    updateTileByPos(pos, newValue) {
      this.data[pos.rowIndex][pos.cellIndex] = newValue
    }
  
    availableCells() {
      const availPositions = []
  
      for (let irow = 0; irow < this.size; ++irow) {
        for (let icell = 0; icell < this.size; ++icell) {
          if (this.data[irow][icell] == 0) {
            availPositions.push({ rowIndex: irow, cellIndex: icell })
          }
        }
      }
  
      return availPositions
    }
  
    getRowDataByDirection(move) {
      const result = []
  
      switch (move) {
        case Direction.Left:
          for (let irow = 0; irow < this.size; ++irow) {
            const row = []
            for (let icell = 0; icell < this.size; ++icell) {
              row.push(this.getTile(irow, icell))
            }
            result.push(row)
          }
          break
        case Direction.Right:
          for (let irow = 0; irow < this.size; ++irow) {
            const row = []
            for (let icell = 0; icell < this.size; ++icell) {
              row.push(this.getTile(irow, this.size - icell - 1))
            }
            result.push(row)
          }
          break
        case Direction.Up:
          for (let icell = 0; icell < this.size; ++icell) {
            const row = []
            for (let irow = 0; irow < this.size; ++irow) {
              row.push(this.getTile(irow, icell))
            }
            result.push(row)
          }
          break
        case Direction.Down:
          for (let icell = 0; icell < this.size; ++icell) {
            const row = []
            for (let irow = 0; irow < this.size; ++irow) {
              row.push(this.getTile(this.size - irow - 1, icell))
            }
            result.push(row)
          }
          break
      }
      return result
    }
  }
  