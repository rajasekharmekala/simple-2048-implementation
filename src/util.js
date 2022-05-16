
export class CellUpdate {
  constructor(oldIndex,newIndex,value,mergedValue = 0) {
    this.oldIndex = oldIndex
    this.newIndex = newIndex
    this.value = value
    this.mergedValue = mergedValue
  }

  get isDeleted() {
    return this.mergedValue < 0
  }

  get isMerged() {
    return this.mergedValue > 0
  }
}

export default class {

  static updateCells(cells){
    let valueToMerge = cells[0].value
    let availablecolIndex = cells[0].value > 0 ? 1 : 0
    const moves = []
    let moveEventBeforeMerge = undefined

    for (let ir = 1; ir < cells.length; ++ir) {
      const current = cells[ir].value

      if (current == 0) {
        // Skip zeros
        continue
      }

      if (valueToMerge != current) {
        if (ir > availablecolIndex) {
          // Move case
          moveEventBeforeMerge = new CellUpdate(
            ir,
            availablecolIndex,
            current
          )
          moves.push(moveEventBeforeMerge)
        }
        valueToMerge = current
        ++availablecolIndex
        continue
      }

      // Merge case (accumulatedValue != current)
      // If we do merge after move then
      if (moveEventBeforeMerge) {
        moveEventBeforeMerge.mergedValue = -1
      } else {
        // Fake move event just for deletion
        moves.push(
          new CellUpdate(
            availablecolIndex - 1,
            availablecolIndex - 1,
            current,
            -1
          )
        )
      }
      moves.push(
        new CellUpdate(
          ir,
          availablecolIndex - 1,
          current,
          current + valueToMerge
        )
      )

      valueToMerge = 0 // Don't allow all merges in one turn
    }

    return moves
  }
}
