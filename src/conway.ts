export default function Conway(size: number) {
  // Our cells. Each is a byte that represents the following:
  //
  // 7 6 5 4 3 2 1 0
  // ┗━┳━┛ ┗━━┳━━┛ ┗━ Cell state. 1 is on, 0 is off
  //   ┃      ┗━━━━━━ Number of on neighbors (0-8)
  //   ┗━━━━━━━━━━━━━ Not used
  //
  const cells = new Uint8Array(size * size);

  /**
   * Log the cells to the console. Useful for debugging.
   */
  function debug() {
    console.log(Array.from(cells).map(function (cell) {
      return {
        raw: cell,
        state: cell & 1,
        neighborCount: cell >>> 1,
      };
    }));
  }

  /**
   * Draw an iteration of the game of life.
   */
  function draw(canvas: HTMLCanvasElement): void {
    const context = canvas.getContext('2d')!;

    // Figure out how big we need to draw each cell.
    const cellHeight = Math.floor(canvas.height / size);
    const cellWidth = Math.floor(canvas.width / size);

    // Erase everything.
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw each cell. We only need to stop for live cells.
    cells.forEach(function (cell, index) {
      // If the cell is on, draw it. For the cell to be on the first bit must be 1.
      if ((cell & 1) === 1) {
        const [row, column] = getCoordFromIndex(index);
        const x = row * cellWidth;
        const y = column * cellHeight;
        context.fillRect(x, y, cellWidth, cellHeight);
      }
    });
  }

  /**
   * Erase everything and fill with random data.
   */
  function randomize(): void {
    // Zero out each cell. This sets the neighbor count to 0, which makes it easier to randomize
    // and update the neighbor count.
    for (let index = 0; index < cells.length; index++) {
      cells[index] = 0;
    }

    // Randomize and update neighbor counts.
    for (let index = 0; index < cells.length; index++) {
      const value = Math.round(Math.random());

      cells[index] |= value;

      if (value) {
        incrementSurroundingNeighborCounts(index);
      }
    }
  }

  /**
   * Convert a 1-dimensional array index to a 2-dimensional row and column.
   */
  function getCoordFromIndex(index: number): [x: number, y: number] {
    return [
      index % size,
      Math.floor(index / size),
    ];
  }

  /**
   * Increment the neighbor counts for all 8 cells around an index.
   */
  function incrementSurroundingNeighborCounts(index: number): void {
    const [x, y] = getCoordFromIndex(index);
    incrementNeighborCount(getIndexFromCoord(wrapAroundSize(x - 1), wrapAroundSize(y - 1)));
    incrementNeighborCount(getIndexFromCoord(wrapAroundSize(x - 1), y));
    incrementNeighborCount(getIndexFromCoord(wrapAroundSize(x - 1), wrapAroundSize(y + 1)));
    incrementNeighborCount(getIndexFromCoord(x,                     wrapAroundSize(y - 1)));
    incrementNeighborCount(getIndexFromCoord(x,                     wrapAroundSize(y + 1)));
    incrementNeighborCount(getIndexFromCoord(wrapAroundSize(x + 1), wrapAroundSize(y - 1)));
    incrementNeighborCount(getIndexFromCoord(wrapAroundSize(x + 1), y));
    incrementNeighborCount(getIndexFromCoord(wrapAroundSize(x + 1), wrapAroundSize(y + 1)));
  }

  /**
   * Increment the neighbor count of a cell.
   */
  function incrementNeighborCount(index: number): void {
    // Extract the current count.
    const currentCount = cells[index] >>> 1;
    // Increment and convert to the desired bits.
    const nextCount = currentCount + 1;
    const countBits = nextCount << 1;
    // Clear out the old count bits.
    cells[index] &= 0b11100001;
    // Set the new bits.
    cells[index] |= countBits;
  }

  /**
   * Convert a 2-dimensional row and column into a 1-dimensional index.
   */
  function getIndexFromCoord(x: number, y: number): number {
    return x + y * size;
  }

  function wrapAroundSize(coord: number): number {
    if (coord < 0) {
      return size - 1;
    }
    if (coord >= size) {
      return 0;
    }
    return coord;
  }

  return {debug, draw, randomize};
}
