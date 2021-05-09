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
        const row = index % size;
        const column = Math.floor(index / size);
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
    for (let index = 0; index < cells.length; index++) {
      cells[index] = Math.round(Math.random());
    }
  }

  return {draw, randomize};
}
