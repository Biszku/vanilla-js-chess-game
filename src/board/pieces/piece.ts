import { PieceStateArr } from "../../lib/definitions";

class Piece {
  col;
  row;
  color;
  name;
  moved?;
  possibleMoves: [number, number, (string | undefined)?][] = [];
  attackedFields: number[][] | null = null;

  constructor(col: number, row: number, name: string) {
    this.col = col;
    this.row = row;
    this.name = name;
    this.color = row > 4 ? "black" : "white";
    if (name.includes("pawn") || name.includes("king")) this.moved = false;
  }

  setAttackFields(type: string) {
    switch (type) {
      case "pawn":
        this.attackedFields = [
          [this.col - 1, this.color === "white" ? this.row + 1 : this.row - 1],
          [this.col + 1, this.color === "white" ? this.row + 1 : this.row - 1],
        ].filter((el) => el[0] >= 1 && el[0] <= 8);
        break;
      default:
        this.attackedFields = [];
    }
  }

  render() {
    return `<img src=${this.color}-${this.name}.svg  />`;
  }

  setName(name: string, pieceState: PieceStateArr) {
    this.name = name;
    this.legalMoves(pieceState);
  }

  changeCords(cords: [number, number]) {
    this.col = cords[0];
    this.row = cords[1];

    if (this.name.includes("pawn") || this.name.includes("king"))
      this.moved = true;

    this.setAttackFields(this.name);
  }

  legalMoves(pieceState: PieceStateArr) {
    const legalMoves: [number, number, string?][] = [];

    switch (this.name) {
      case "pawn":
        if (this.row === 1 || this.row === 8) break;

        this.attackedFields &&
          this.attackedFields.forEach((cords) => {
            if (
              pieceState.find(
                (piece) =>
                  piece.col === cords[0] &&
                  piece.row === cords[1] &&
                  piece.color !== this.color
              )
            )
              legalMoves.push([cords[0], cords[1], "attack"]);
          });

        const isBlocked = pieceState.find((obj) => {
          if (this.color === "white")
            return obj.col === this.col && obj.row === this.row + 1;
          if (this.color === "black")
            return obj.col === this.col && obj.row === this.row - 1;
        });

        if (isBlocked) break;

        legalMoves.push([
          this.col,
          this.color === "white" ? this.row + 1 : this.row - 1,
        ]);

        const isDoubleFieldMoveAvailable = () => {
          if (this.color === "white")
            return pieceState.find(
              (obj) => obj.col === this.col && obj.row === this.row + 2
            );

          if (this.color === "black")
            return pieceState.find(
              (obj) => obj.col === this.col && obj.row === this.row - 2
            );
        };

        if (!this.moved && !isDoubleFieldMoveAvailable())
          legalMoves.push([
            this.col,
            this.color === "white" ? this.row + 2 : this.row - 2,
          ]);
        break;
      case "knight":
        legalMoves.push(...this.knightMoves(pieceState));
        break;
      case "bishop":
        legalMoves.push(...this.crossMoves(pieceState));
        break;
      case "rook":
        legalMoves.push(...this.verticalMoves(pieceState));
        legalMoves.push(...this.horizontalMoves(pieceState));
        break;
      case "queen":
        legalMoves.push(...this.crossMoves(pieceState));
        legalMoves.push(...this.verticalMoves(pieceState));
        legalMoves.push(...this.horizontalMoves(pieceState));
        break;
      case "king":
        legalMoves.push(...this.kingMoves(pieceState));
        break;
    }
    this.possibleMoves = legalMoves;
  }

  verticalMoves(pieceState: PieceStateArr) {
    const result: [number, number, string?][] = [];
    let isBlocking = false;

    for (let row = this.row + 1; row <= 8; row++) {
      const isOccupied = pieceState.find(
        (piece) => piece.col === this.col && piece.row === row
      );

      if (isOccupied && !isBlocking) {
        if (isOccupied.color === this.color) isBlocking = true;
        else {
          isBlocking = true;
          result.push([this.col, row, "attack"]);
        }
      }

      !isBlocking && result.push([this.col, row]);
    }

    for (let row = this.row - 1; row >= 1; row--) {
      const isOccupied = pieceState.find(
        (piece) => piece.col === this.col && piece.row === row
      );

      if (isOccupied) {
        if (isOccupied.color === this.color) return result;
        else {
          result.push([this.col, row, "attack"]);
          return result;
        }
      }

      result.push([this.col, row]);
    }
    return result;
  }

  horizontalMoves(pieceState: PieceStateArr) {
    const result: [number, number, string?][] = [];
    let isBlocking = false;

    for (let col = this.col + 1; col <= 8; col++) {
      const isOccupied = pieceState.find(
        (piece) => piece.col === col && piece.row === this.row
      );

      if (isOccupied && !isBlocking) {
        if (isOccupied.color === this.color) isBlocking = true;
        else {
          isBlocking = true;
          result.push([col, this.row, "attack"]);
        }
      }

      !isBlocking && result.push([col, this.row]);
    }

    for (let col = this.col - 1; col >= 1; col--) {
      const isOccupied = pieceState.find(
        (piece) => piece.col === col && piece.row === this.row
      );

      if (isOccupied) {
        if (isOccupied.color === this.color) return result;
        else {
          result.push([col, this.row, "attack"]);
          return result;
        }
      }

      result.push([col, this.row]);
    }
    return result;
  }

  crossMoves(pieceState: PieceStateArr) {
    const result: [number, number, string?][] = [];
    const numOfIterations = [0, 0];
    const isBlockingLeftSide = [false, false];
    const isBlockingRightSide = [false, false];

    for (let col = this.col - 1; col >= 1; col--) {
      numOfIterations[0] += 1;

      const isOccupiedUp = pieceState.find(
        (piece) =>
          piece.col === col && piece.row === this.row + numOfIterations[0]
      );

      const isOccupiedDown = pieceState.find(
        (piece) =>
          piece.col === col && piece.row === this.row - numOfIterations[0]
      );

      if (isOccupiedUp && !isBlockingLeftSide[0]) {
        isBlockingLeftSide[0] = true;
        if (isOccupiedUp.color !== this.color)
          result.push([col, this.row + numOfIterations[0], "attack"]);
      }
      if (isOccupiedDown && !isBlockingLeftSide[1]) {
        isBlockingLeftSide[1] = true;
        if (isOccupiedDown.color !== this.color)
          result.push([col, this.row - numOfIterations[0], "attack"]);
      }

      !isBlockingLeftSide[0] &&
        result.push([col, this.row + numOfIterations[0]]);
      !isBlockingLeftSide[1] &&
        result.push([col, this.row - numOfIterations[0]]);
    }

    for (let col = this.col + 1; col <= 8; col++) {
      numOfIterations[1] += 1;

      const isOccupiedUp = pieceState.find(
        (piece) =>
          piece.col === col && piece.row === this.row + numOfIterations[1]
      );

      const isOccupiedDown = pieceState.find(
        (piece) =>
          piece.col === col && piece.row === this.row - numOfIterations[1]
      );

      if (isOccupiedUp && !isBlockingRightSide[0]) {
        isBlockingRightSide[0] = true;
        if (isOccupiedUp.color !== this.color)
          result.push([col, this.row + numOfIterations[1], "attack"]);
      }
      if (isOccupiedDown && !isBlockingRightSide[1]) {
        isBlockingRightSide[1] = true;
        if (isOccupiedDown.color !== this.color)
          result.push([col, this.row - numOfIterations[1], "attack"]);
      }

      !isBlockingRightSide[0] &&
        result.push([col, this.row + numOfIterations[1]]);
      !isBlockingRightSide[1] &&
        result.push([col, this.row - numOfIterations[1]]);
    }

    return result.filter((cords) => cords[1] >= 1 && cords[1] <= 8);
  }

  knightMoves(pieceState: PieceStateArr) {
    const result: [number, number, string?][] = [];
    result.push([this.col + 2, this.row + 1], [this.col + 2, this.row - 1]);
    result.push([this.col - 2, this.row + 1], [this.col - 2, this.row - 1]);

    result.push([this.col + 1, this.row + 2], [this.col - 1, this.row + 2]);

    result.push([this.col + 1, this.row - 2], [this.col - 1, this.row - 2]);

    const filteredResult = result.filter((cords) => {
      const [col, row] = cords;

      const occupiedField = pieceState.find(
        (piece) => piece.col === col && piece.row === row
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
          (piece) => piece.col === col && piece.row === row
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
      [this.col + 1, this.row + 1],
      [this.col, this.row + 1],
      [this.col - 1, this.row + 1]
    );
    result.push(
      [this.col + 1, this.row - 1],
      [this.col, this.row - 1],
      [this.col - 1, this.row - 1]
    );

    result.push([this.col - 1, this.row]);

    result.push([this.col + 1, this.row]);

    const filteredResult = result.filter((cords) => {
      const [col, row] = cords;

      const occupiedField = pieceState.find(
        (piece) => piece.col === col && piece.row === row
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
          (piece) => piece.col === col && piece.row === row
        );

        if (occupiedField && occupiedField.color !== this.color)
          return [col, row, "attack"];
        else return [col, row];
      });

    return finalResult;
  }
}

export default Piece;
