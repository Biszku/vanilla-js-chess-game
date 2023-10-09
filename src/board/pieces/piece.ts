class Piece {
  // startingCol;
  // startingRow;
  curCol;
  curRow;
  name;
  color;

  constructor(col: number, row: number, name: string) {
    // this.startingCol = col;
    // this.startingRow = row;
    this.curCol = col;
    this.curRow = row;
    this.name = name;
    this.color = col <= 4 ? "black" : "white";
  }

  render() {
    return `<img src=${this.color}-${this.name}.png  />`;
  }
}

export default Piece;
