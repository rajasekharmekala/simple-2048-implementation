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
  
    updateCell(irow, icol, value) {
        if(irow >=0 && irow<this.size && icol >=0 && icol < this.size && this.data[irow][icol] == 0){
            this.data[irow][icol] = value
        }
    }
  
    clearTile(irow, icol) {
      this.data[irow][icol] = 0
    }
  
    getCell(irow, icol) {
      return {
        rowIndex: irow,
        colIndex: icol,
        value: this.data[irow][icol]
      }
    }
  
  
    availableCells() {
      const availPositions = []
  
      for (let irow = 0; irow < this.size; ++irow) {
        for (let icol = 0; icol < this.size; ++icol) {
          if (this.data[irow][icol] == 0) {
            availPositions.push({ rowIndex: irow, colIndex: icol })
          }
        }
      }
  
      return availPositions
    }
  
    groupRows(move) {
      const result = []
  
      switch (move) {
        case Direction.Left:
          for (let irow = 0; irow < this.size; ++irow) {
            const row = []
            for (let icol = 0; icol < this.size; ++icol) {
              row.push(this.getCell(irow, icol))
            }
            result.push(row)
          }
          break
        case Direction.Right:
          for (let irow = 0; irow < this.size; ++irow) {
            const row = []
            for (let icol = 0; icol < this.size; ++icol) {
              row.push(this.getCell(irow, this.size - icol - 1))
            }
            result.push(row)
          }
          break
        case Direction.Up:
          for (let icol = 0; icol < this.size; ++icol) {
            const row = []
            for (let irow = 0; irow < this.size; ++irow) {
              row.push(this.getCell(irow, icol))
            }
            result.push(row)
          }
          break
        case Direction.Down:
          for (let icol = 0; icol < this.size; ++icol) {
            const row = []
            for (let irow = 0; irow < this.size; ++irow) {
              row.push(this.getCell(this.size - irow - 1, icol))
            }
            result.push(row)
          }
          break
      }
      return result
    }
  }
  