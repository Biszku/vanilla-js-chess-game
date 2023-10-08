import Piece from "./pieces/piece";

class Board {
  columns = 8;
  rows = 8;
  initialColor = "white";
  piecePattern = [
    "rook",
    "knight",
    "bishop",
    "queen",
    "king",
    "bishop",
    "knight",
    "rook",
  ];
  coordinates = {
    horizontal: ["1", "2", "3", "4", "5", "6", "7", "8"].reverse(),
    vertical: ["A", "B", "C", "D", "E", "F", "G", "H"],
  };
  parentElement = document.querySelector(".main-field") as HTMLDivElement;
  boardState = new Map();

  creatingBoard() {
    this.renderMainBoard();
    this.renderBounds();
    this.createFieldsAssignment();
  }

  createFieldsAssignment() {
    const Fields = document.querySelectorAll(".chess-field");
    for (let cols = 1; cols <= this.columns; cols++) {
      for (let rows = 1; rows <= this.rows; rows++) {
        const index = (cols - 1) * 8 + (rows - 1);
        this.boardState.set([cols, rows], Fields[index]);
      }
    }
    console.log(this.boardState);
  }

  renderElement(comps: string, location: string | null = null) {
    this.parentElement.insertAdjacentHTML(
      location === "outside" ? "beforebegin" : "afterbegin",
      comps
    );
  }

  renderBounds() {
    for (let curBound = 1; curBound <= 4; curBound++) {
      if (curBound <= 2) {
        this.renderElement(this.renderBound("vertical"), "outside");
      } else {
        this.renderElement(this.renderBound(), "outside");
      }
    }
  }

  renderBound(boundType: string = "horizontal") {
    return `<div class=${
      boundType === "vertical" ? "vertical" : "horizontal"
    }-bound>${this.coordinates[boundType]
      .map(
        (el: string | number) =>
          `<div class=coordinate-fieled><span class=coordinate-chart>${el}</span></div>`
      )
      .join("")}</div>`;
  }

  renderMainBoard() {
    const MainBoard = [];
    let curInitColor = this.initialColor;

    for (let cols = 1; cols <= this.columns; cols++) {
      let curColor = curInitColor;
      for (let rows = 1; rows <= this.rows; rows++) {
        const renderedField = this.renderField(curColor, cols, rows);

        MainBoard.push(renderedField);
        curColor = curColor === "white" ? "black" : "white";
      }
      curInitColor = curInitColor === "white" ? "black" : "white";
    }
    this.renderElement(MainBoard.join(""));
  }

  renderField(color: string, col: number, row: number) {
    const colorClass = color === "black" ? "black-field" : "white-field";
    return `<div class="chess-field ${colorClass}">${this.renderPiece(
      col,
      row
    )}</div>`;
  }

  renderPiece(col: number, row: number) {
    const piece =
      col === 1 || col === 8
        ? new Piece(col, row, this.piecePattern[row - 1])
        : col === 2 || col === 7
        ? new Piece(col, row, "pawn")
        : "";
    return piece && piece.render();
  }
}

export default new Board();
