import { PieceStateArr } from "../board";

class Piece {
  curCol;
  curRow;
  name;
  color;
  possibleMoves: [number, number, (string | undefined)?][] = [];
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
        legalMoves.push(...this.kingMoves(pieceState));
        break;
      case "queen":
        legalMoves.push(...this.crossMoves(pieceState));
        legalMoves.push(...this.verticalMoves(pieceState));
        legalMoves.push(...this.horizontalMoves(pieceState));
        break;
      case "bishop":
        legalMoves.push(...this.crossMoves(pieceState));
        break;
      case "knight":
        legalMoves.push(...this.knightMoves(pieceState));
        break;
      case "rook":
        legalMoves.push(...this.verticalMoves(pieceState));
        legalMoves.push(...this.horizontalMoves(pieceState));
        break;
    }
    this.possibleMoves = legalMoves;
  }

  verticalMoves(pieceState: PieceStateArr) {
    const result: [number, number, string?][] = [];
    let isBlocking = false;

    for (let curRow = this.curRow + 1; curRow <= 8; curRow++) {
      const isOccupied = pieceState.find(
        (piece) => piece.curCol === this.curCol && piece.curRow === curRow
      );

      if (isOccupied && !isBlocking) {
        if (isOccupied.color === this.color) isBlocking = true;
        else {
          isBlocking = true;
          result.push([this.curCol, curRow, "attack"]);
        }
      }

      !isBlocking && result.push([this.curCol, curRow]);
    }

    for (let curRow = this.curRow - 1; curRow >= 1; curRow--) {
      const isOccupied = pieceState.find(
        (piece) => piece.curCol === this.curCol && piece.curRow === curRow
      );

      if (isOccupied) {
        if (isOccupied.color === this.color) return result;
        else {
          result.push([this.curCol, curRow, "attack"]);
          return result;
        }
      }

      result.push([this.curCol, curRow]);
    }
    return result;
  }

  horizontalMoves(pieceState: PieceStateArr) {
    const result: [number, number, string?][] = [];
    let isBlocking = false;

    for (let curCol = this.curCol + 1; curCol <= 8; curCol++) {
      const isOccupied = pieceState.find(
        (piece) => piece.curCol === curCol && piece.curRow === this.curRow
      );

      if (isOccupied && !isBlocking) {
        if (isOccupied.color === this.color) isBlocking = true;
        else {
          isBlocking = true;
          result.push([curCol, this.curRow, "attack"]);
        }
      }

      !isBlocking && result.push([curCol, this.curRow]);
    }

    for (let curCol = this.curCol - 1; curCol >= 1; curCol--) {
      const isOccupied = pieceState.find(
        (piece) => piece.curCol === curCol && piece.curRow === this.curRow
      );

      if (isOccupied) {
        if (isOccupied.color === this.color) return result;
        else {
          result.push([curCol, this.curRow, "attack"]);
          return result;
        }
      }

      result.push([curCol, this.curRow]);
    }
    return result;
  }

  crossMoves(pieceState: PieceStateArr) {
    const result: [number, number, string?][] = [];
    const numOfIterations = [0, 0];
    const isBlockingLeftSide = [false, false];
    const isBlockingRightSide = [false, false];

    for (let curCol = this.curCol - 1; curCol >= 1; curCol--) {
      numOfIterations[0] += 1;

      const isOccupiedUp = pieceState.find(
        (piece) =>
          piece.curCol === curCol &&
          piece.curRow === this.curRow + numOfIterations[0]
      );

      const isOccupiedDown = pieceState.find(
        (piece) =>
          piece.curCol === curCol &&
          piece.curRow === this.curRow - numOfIterations[0]
      );

      if (isOccupiedUp && !isBlockingLeftSide[0]) {
        isBlockingLeftSide[0] = true;
        if (isOccupiedUp.color !== this.color)
          result.push([curCol, this.curRow + numOfIterations[0], "attack"]);
      }
      if (isOccupiedDown && !isBlockingLeftSide[1]) {
        isBlockingLeftSide[1] = true;
        if (isOccupiedDown.color !== this.color)
          result.push([curCol, this.curRow + numOfIterations[0], "attack"]);
      }

      !isBlockingLeftSide[0] &&
        result.push([curCol, this.curRow + numOfIterations[0]]);
      !isBlockingLeftSide[1] &&
        result.push([curCol, this.curRow - numOfIterations[0]]);
    }

    for (let curCol = this.curCol + 1; curCol <= 8; curCol++) {
      numOfIterations[1] += 1;

      const isOccupiedUp = pieceState.find(
        (piece) =>
          piece.curCol === curCol &&
          piece.curRow === this.curRow + numOfIterations[1]
      );

      const isOccupiedDown = pieceState.find(
        (piece) =>
          piece.curCol === curCol &&
          piece.curRow === this.curRow - numOfIterations[1]
      );

      if (isOccupiedUp && !isBlockingRightSide[0]) {
        isBlockingRightSide[0] = true;
        if (isOccupiedUp.color !== this.color)
          result.push([curCol, this.curRow + numOfIterations[1], "attack"]);
      }
      if (isOccupiedDown && !isBlockingRightSide[1]) {
        isBlockingRightSide[1] = true;
        if (isOccupiedDown.color !== this.color)
          result.push([curCol, this.curRow + numOfIterations[1], "attack"]);
      }

      !isBlockingRightSide[0] &&
        result.push([curCol, this.curRow + numOfIterations[1]]);
      !isBlockingRightSide[1] &&
        result.push([curCol, this.curRow - numOfIterations[1]]);
    }

    return result.filter((cords) => cords[1] >= 1 && cords[1] <= 8);
  }

  knightMoves(pieceState: PieceStateArr) {
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

    const filteredResult = result.filter((cords) => {
      const [col, row] = cords;

      const occupiedField = pieceState.find(
        (piece) => piece.curCol === col && piece.curRow === row
      );

      if (
        col >= 1 &&
        col <= 8 &&
        row >= 1 &&
        row <= 8 &&
        occupiedField?.color !== this.color
      )
        return true;
      else return false;
    });

    const finalResults: [number, number, (string | undefined)?][] =
      filteredResult.map((cords) => {
        const [col, row] = cords;

        const occupiedField = pieceState.find(
          (piece) => piece.curCol === col && piece.curRow === row
        );

        if (occupiedField && occupiedField.color !== this.color)
          return [col, row, "attack"];
        else return [col, row];
      });

    return finalResults;
  }

  kingMoves(pieceState: PieceStateArr) {
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

    const filteredResult = result.filter((cords) => {
      const [col, row] = cords;

      const occupiedField = pieceState.find(
        (piece) => piece.curCol === col && piece.curRow === row
      );

      if (
        cords[0] >= 1 &&
        cords[0] <= 8 &&
        cords[1] >= 1 &&
        cords[1] <= 8 &&
        occupiedField?.color !== this.color
      )
        return true;
      else return false;
    });

    const finalResult: [number, number, (string | undefined)?][] =
      filteredResult.map((cords) => {
        const [col, row] = cords;

        const occupiedField = pieceState.find(
          (piece) => piece.curCol === col && piece.curRow === row
        );

        if (occupiedField && occupiedField.color !== this.color)
          return [col, row, "attack"];
        else return [col, row];
      });

    return finalResult;
  }
}

export default Piece;
