
export class TileUpdateEvent {
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

export class RowProcessor {
  static ProcessRow(tiles){
    let valueToMerge = tiles[0].value
    let availablecolIndex = tiles[0].value > 0 ? 1 : 0
    const resultEvents = []
    let moveEventBeforeMerge = undefined

    for (let ir = 1; ir < tiles.length; ++ir) {
      const current = tiles[ir].value

      if (current == 0) {
        // Skip zeros
        continue
      }

      if (valueToMerge != current) {
        if (ir > availablecolIndex) {
          // Move case
          moveEventBeforeMerge = new TileUpdateEvent(
            ir,
            availablecolIndex,
            current
          )
          resultEvents.push(moveEventBeforeMerge)
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
        resultEvents.push(
          new TileUpdateEvent(
            availablecolIndex - 1,
            availablecolIndex - 1,
            current,
            -1
          )
        )
      }
      resultEvents.push(
        new TileUpdateEvent(
          ir,
          availablecolIndex - 1,
          current,
          current + valueToMerge
        )
      )

      valueToMerge = 0 // Don't allow all merges in one turn
    }

    return resultEvents
  }
}
