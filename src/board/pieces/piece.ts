class Piece {
  curCol;
  curRow;
  name;
  color;
  moved?;

  constructor(col: number, row: number, name: string) {
    this.curCol = col;
    this.curRow = row;
    this.name = name;
    this.color = row > 4 ? "black" : "white";
    if (name.includes("pawn") || name.includes("king")) this.moved = false;
  }

  render() {
    return `<img src=${this.color}-${this.name}.png  />`;
  }

  changeCords(cords: number[]) {
    this.curCol = cords[0];
    this.curRow = cords[1];

    if (this.name.includes("pawn") || this.name.includes("king"))
      this.moved = true;
  }

  legalMoves() {
    const legalMoves = [];

    switch (this.name) {
      case "pawn":
        legalMoves.push([
          this.curCol,
          this.color === "white" ? this.curRow + 1 : this.curRow - 1,
        ]);

        if (!this.moved)
          legalMoves.push([
            this.curCol,
            this.color === "white" ? this.curRow + 2 : this.curRow - 2,
          ]);

        return legalMoves;
      default:
        return [[21], [37]];
    }
  }
}

export default Piece;
