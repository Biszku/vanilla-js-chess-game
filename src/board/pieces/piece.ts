import { PieceStateArr } from "../board";

class Piece {
  curCol;
  curRow;
  name;
  color;
  possibleMoves: [number, number, (string | undefined)?][] | [] = [];
  attackedFields: number[][] | null = null;
  moved?;

  constructor(col: number, row: number, name: string) {
    this.curCol = col;
    this.curRow = row;
    this.name = name;
    this.color = row > 4 ? "black" : "white";
    this.setAttackFields(name);
    if (name.includes("pawn") || name.includes("king")) this.moved = false;
  }

  setAttackFields(type: string) {
    switch (type) {
      case "pawn":
        this.attackedFields = [
          [
            this.curCol - 1,
            this.color === "white" ? this.curRow + 1 : this.curRow - 1,
          ],
          [
            this.curCol + 1,
            this.color === "white" ? this.curRow + 1 : this.curRow - 1,
          ],
        ].filter((el) => el[0] >= 1 && el[0] <= 8);
        break;
      default:
        this.attackedFields = [];
    }
  }

  render() {
    return `<img src=${this.color}-${this.name}.svg  />`;
  }
  setName(name: string) {
    this.name = name;
    this.setAttackFields(this.name);
  }

  changeCords(cords: [number, number]) {
    this.curCol = cords[0];
    this.curRow = cords[1];

    if (this.name.includes("pawn") || this.name.includes("king"))
      this.moved = true;

    this.setAttackFields(this.name);
  }

  legalMoves(pieceState: PieceStateArr) {
    const legalMoves: [number, number, string?][] = [];

    switch (this.name) {
      case "pawn":
        if (this.curRow === 1 || this.curRow === 8) break;

        this.attackedFields &&
          this.attackedFields.forEach((cords) => {
            if (
              pieceState.find(
                (piece) =>
                  piece.curCol === cords[0] &&
                  piece.curRow === cords[1] &&
                  piece.color !== this.color
              )
            )
              legalMoves.push([cords[0], cords[1], "attack"]);
          });

        const isBlocked = pieceState.find((obj) => {
          if (this.color === "white")
            return obj.curCol === this.curCol && obj.curRow === this.curRow + 1;
          if (this.color === "black")
            return obj.curCol === this.curCol && obj.curRow === this.curRow - 1;
        });

        if (isBlocked) break;

        legalMoves.push([
          this.curCol,
          this.color === "white" ? this.curRow + 1 : this.curRow - 1,
        ]);

        const isDoubleFieldMoveAvailable = () => {
          if (this.color === "white")
            return pieceState.find(
              (obj) =>
                obj.curCol === this.curCol && obj.curRow === this.curRow + 2
            );

          if (this.color === "black")
            return pieceState.find(
              (obj) =>
                obj.curCol === this.curCol && obj.curRow === this.curRow - 2
            );
        };

        if (!this.moved && !isDoubleFieldMoveAvailable())
          legalMoves.push([
            this.curCol,
            this.color === "white" ? this.curRow + 2 : this.curRow - 2,
          ]);
        break;
      case "king":
        legalMoves.push(...this.kingMoves());
        break;
      case "queen":
        legalMoves.push(...this.crossMoves());
        legalMoves.push(...this.verticalMoves());
        legalMoves.push(...this.horizontalMoves());
        break;
      case "bishop":
        legalMoves.push(...this.crossMoves());
        break;
      case "knight":
        legalMoves.push(...this.knightMoves());
        break;
      case "rook":
        legalMoves.push(...this.verticalMoves());
        legalMoves.push(...this.horizontalMoves());
        break;
    }
    this.possibleMoves = legalMoves;
  }

  verticalMoves() {
    const result: [number, number, string?][] = [];
    for (let curRow = this.curRow + 1; curRow <= 8; curRow++) {
      result.push([this.curCol, curRow]);
    }
    for (let curRow = this.curRow - 1; curRow >= 1; curRow--) {
      result.push([this.curCol, curRow]);
    }
    return result;
  }

  horizontalMoves() {
    const result: [number, number, string?][] = [];
    for (let curCol = this.curCol + 1; curCol <= 8; curCol++) {
      result.push([curCol, this.curRow]);
    }
    for (let curCol = this.curCol - 1; curCol >= 1; curCol--) {
      result.push([curCol, this.curRow]);
    }
    return result;
  }

  crossMoves() {
    const result: [number, number, string?][] = [];
    const numOfIterations = [0, 0];
    for (let curCol = this.curCol - 1; curCol >= 1; curCol--) {
      numOfIterations[0] += 1;
      result.push(
        [curCol, this.curRow + numOfIterations[0]],
        [curCol, this.curRow - numOfIterations[0]]
      );
    }

    for (let curCol = this.curCol + 1; curCol <= 8; curCol++) {
      numOfIterations[1] += 1;
      result.push(
        [curCol, this.curRow + numOfIterations[1]],
        [curCol, this.curRow - numOfIterations[1]]
      );
    }
    return result.filter((cords) => cords[1] >= 1 && cords[1] <= 8);
  }

  knightMoves() {
    const result: [number, number, string?][] = [];
    result.push(
      [this.curCol + 2, this.curRow + 1],
      [this.curCol + 2, this.curRow - 1]
    );
    result.push(
      [this.curCol - 2, this.curRow + 1],
      [this.curCol - 2, this.curRow - 1]
    );

    result.push(
      [this.curCol + 1, this.curRow + 2],
      [this.curCol - 1, this.curRow + 2]
    );

    result.push(
      [this.curCol + 1, this.curRow - 2],
      [this.curCol - 1, this.curRow - 2]
    );

    return result.filter(
      (cords) =>
        cords[0] >= 1 && cords[0] <= 8 && cords[1] >= 1 && cords[1] <= 8
    );
  }

  kingMoves() {
    const result: [number, number, string?][] = [];
    result.push(
      [this.curCol + 1, this.curRow + 1],
      [this.curCol, this.curRow + 1],
      [this.curCol - 1, this.curRow + 1]
    );
    result.push(
      [this.curCol + 1, this.curRow - 1],
      [this.curCol, this.curRow - 1],
      [this.curCol - 1, this.curRow - 1]
    );

    result.push([this.curCol - 1, this.curRow]);

    result.push([this.curCol + 1, this.curRow]);

    return result.filter(
      (cords) =>
        cords[0] >= 1 && cords[0] <= 8 && cords[1] >= 1 && cords[1] <= 8
    );
  }
}

export default Piece;
