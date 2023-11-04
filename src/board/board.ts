import Piece from "./pieces/piece";
import { PieceStateArr } from "../lib/definitions";
import { CoordinateTypes } from "../lib/definitions";

class Board {
  private columns = 8;
  private rows = 8;
  private startingRowColor = "white";
  private pieces = [
    "rook",
    "knight",
    "bishop",
    "queen",
    "king",
    "bishop",
    "knight",
    "rook",
  ];
  private coordinates: CoordinateTypes = {
    horizontal: ["1", "2", "3", "4", "5", "6", "7", "8"].reverse(),
    vertical: ["A", "B", "C", "D", "E", "F", "G", "H"],
  };
  private parentElement = document.querySelector(
    ".main-field"
  ) as HTMLDivElement;
  protected boardState = new Map();
  protected boardStateByCords = new Map();
  protected pieceState: PieceStateArr = [];

  creatingBoard() {
    this.renderMainBoard();
    this.renderBounds();
    this.createFieldsAssignment();
    this.renderInitialMoves();
  }

  private renderMainBoard() {
    const MainBoard = [];
    let fieldColor = this.startingRowColor;

    for (let rows = this.rows; rows >= 1; rows--) {
      let curColor = fieldColor;

      for (let cols = 1; cols <= this.columns; cols++) {
        const renderedField = this.renderField(curColor, cols, rows);
        MainBoard.push(renderedField);
        curColor = curColor === "white" ? "black" : "white";
      }
      fieldColor = fieldColor === "white" ? "black" : "white";
    }
    this.renderElement(MainBoard.join(""));
  }

  private renderField(color: string, col: number, row: number) {
    return `<div class="chess-field ${color + "-field"}">${this.renderPiece(
      col,
      row
    )}</div>`;
  }

  private renderPiece(col: number, row: number) {
    const piece =
      row === 1 || row === 8
        ? new Piece(col, row, this.pieces[col - 1])
        : row === 2 || row === 7
        ? new Piece(col, row, "pawn")
        : null;

    if (!piece) return "";
    this.pieceState.push(piece);
    return piece.render();
  }

  private renderBounds() {
    for (let curBound = 1; curBound <= 4; curBound++) {
      if (curBound <= 2) {
        this.renderElement(this.renderBound("vertical"), "outside");
      } else {
        this.renderElement(this.renderBound(), "outside");
      }
    }
  }

  private renderElement(comps: string, location: string | null = null) {
    this.parentElement.insertAdjacentHTML(
      location === "outside" ? "beforebegin" : "afterbegin",
      comps
    );
  }

  private renderBound(boundType: string = "horizontal") {
    const index = boundType;

    return `<div class=${boundType}-bound>${this.coordinates[index]
      .map(
        (el: string | number) =>
          `<div class=coordinate-fieled><span class=coordinate-chart>${el}</span></div>`
      )
      .join("")}
    </div>`;
  }

  private createFieldsAssignment() {
    const Fields = document.querySelectorAll(".chess-field");
    const dividedFields = [];

    for (let i = 0; i <= 63; i += 8) {
      dividedFields.push([...Fields].slice(i, i + 8));
    }

    const rightArr = dividedFields.reverse().flat(2);

    for (let rows = 1; rows <= this.rows; rows++) {
      for (let cols = 1; cols <= this.columns; cols++) {
        const index = (rows - 1) * 8 + (cols - 1);
        this.boardState.set(rightArr[index], [cols, rows]);
        this.boardStateByCords.set(cols + `${rows}`, rightArr[index]);
      }
    }
  }

  private renderInitialMoves() {
    this.pieceState.forEach((piece) => piece.legalMoves(this.pieceState));
  }
}

export default Board;
