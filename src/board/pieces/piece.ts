class Piece {
  startingCol;
  startingRow;
  curCol;
  curRow;
  name;

  constructor(col: number, row: number, name: string) {
    this.startingCol = col;
    this.startingRow = row;
    this.curCol = col;
    this.curRow = row;
    this.name = name;
  }

  render() {
    return `<img src=${this.startingCol <= 4 ? "black" : "white"}-${
      this.name
    }.png  />`;
  }
}

export default Piece;
