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
        rawBits: cell.toString(2),
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
   * Turn all cells off.
   */
  function clear(): void {
    for (let index = 0; index < cells.length; index++) {
      cells[index] = 0;
    }
  }

  /**
   * Erase everything and fill with random data.
   */
  function randomize(): void {
    // Zero out each cell. This sets the neighbor count to 0, which makes it easier to randomize
    // and update the neighbor count.
    clear();

    // Randomize and update neighbor counts.
    for (let index = 0; index < cells.length; index++) {
      const value = Math.round(Math.random());

      if (value) {
        setCell(index);
      }
    }
  }

  /**
   * Generate the next iteration.
   */
  function next() {
    debugger;
    const clone = new Uint8Array(cells);

    for (let index = 0; index < clone.length; index++) {
      const cell = clone[index];
      const currentState = cell & 1;
      const neighborCount = cell >>> 1;

      // Update the cell if there's a possibility it has changed.
      if (currentState || neighborCount) {
        const nextState = getNextState(currentState, neighborCount);

        if (nextState !== currentState) {
          if (nextState) {
            setCell(index);
          } else {
            clearCell(index);
          }
        }
      }
    }
  }

  /**
   * Turn a cell on.
   */
  function setCell(index: number): void {
    // Set the state to on.
    cells[index] |= 1;
    // Update neighboring neighbor counts.
    eachNeighbor(incrementNeighborCount, index);
  }

  /**
   * Turn a cell off.
   */
  function clearCell(index: number): void {
    // Set the state to off.
    cells[index] &= ~1;
    // Update neighboring neighbor counts.
    eachNeighbor(decrementNeighborCount, index);
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
   * Perform some operation on all 8 cells around an index.
   */
  function eachNeighbor(operation: (index: number) => void, index: number): void {
    const [x, y] = getCoordFromIndex(index);
    operation(getIndexFromCoord(wrapAroundSize(x - 1), wrapAroundSize(y - 1)));
    operation(getIndexFromCoord(wrapAroundSize(x - 1), y));
    operation(getIndexFromCoord(wrapAroundSize(x - 1), wrapAroundSize(y + 1)));
    operation(getIndexFromCoord(x,                     wrapAroundSize(y - 1)));
    operation(getIndexFromCoord(x,                     wrapAroundSize(y + 1)));
    operation(getIndexFromCoord(wrapAroundSize(x + 1), wrapAroundSize(y - 1)));
    operation(getIndexFromCoord(wrapAroundSize(x + 1), y));
    operation(getIndexFromCoord(wrapAroundSize(x + 1), wrapAroundSize(y + 1)));
  }

  /**
   * Increment the neighbor count of a cell.
   */
  function incrementNeighborCount(index: number): void {
    cells[index] += 0b10;
  }

  /**
   * Decrement the neighbor count of a cell.
   */
  function decrementNeighborCount(index: number): void {
    cells[index] -= 0b10;
  }

  /**
   * Convert a 2-dimensional row and column into a 1-dimensional index.
   */
  function getIndexFromCoord(x: number, y: number): number {
    return x + y * size;
  }

  /**
   * Wrap a row or column number around the height/width of the game.
   */
  function wrapAroundSize(coord: number): number {
    if (coord < 0) {
      return size - 1;
    }
    if (coord >= size) {
      return 0;
    }
    return coord;
  }

  /**
   * Get the next cell state based on the current state and number of neighbors. This is what makes
   * this Conway's Game of Life.
   */
  function getNextState(currentState: number, neighborCount: number) {
    switch (neighborCount) {
      case 3:
        return 1;
      case 2:
        return currentState;
      default:
        return 0;
    }
  }

  return { clear, debug, draw, next, randomize};
}
