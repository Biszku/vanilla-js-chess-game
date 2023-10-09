import Piece from "./pieces/piece";

class Board {
  private columns = 8;
  private rows = 8;
  private initialColor = "white";
  private piecePattern = [
    "rook",
    "knight",
    "bishop",
    "queen",
    "king",
    "bishop",
    "knight",
    "rook",
  ];
  private coordinates = {
    horizontal: ["1", "2", "3", "4", "5", "6", "7", "8"].reverse(),
    vertical: ["A", "B", "C", "D", "E", "F", "G", "H"],
  };
  private parentElement = document.querySelector(
    ".main-field"
  ) as HTMLDivElement;
  protected boardState = new Map();
  protected pieceState: {
    color: string;
    curCol: number;
    curRow: number;
    name: string;
    // startingCol: number;
    // startingRow: number;
  }[] = [];

  creatingBoard() {
    this.renderMainBoard();
    this.renderBounds();
    this.createFieldsAssignment();
  }

  private createFieldsAssignment() {
    const Fields = document.querySelectorAll(".chess-field");
    const dividedFields = [];

    for (let i = 0; i <= 63; i += 8) {
      dividedFields.push([...Fields].slice(i, i + 8));
    }

    const rightArr = dividedFields.reverse().flat(2);

    for (let cols = 1; cols <= this.columns; cols++) {
      for (let rows = 1; rows <= this.rows; rows++) {
        const index = (cols - 1) * 8 + (rows - 1);
        this.boardState.set(rightArr[index], [cols, rows]);
      }
    }
  }

  private renderElement(comps: string, location: string | null = null) {
    this.parentElement.insertAdjacentHTML(
      location === "outside" ? "beforebegin" : "afterbegin",
      comps
    );
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

  private renderBound(boundType: string = "horizontal") {
    return `<div class=${
      boundType === "vertical" ? "vertical" : "horizontal"
    }-bound>${this.coordinates[boundType]
      .map(
        (el: string | number) =>
          `<div class=coordinate-fieled><span class=coordinate-chart>${el}</span></div>`
      )
      .join("")}</div>`;
  }

  private renderMainBoard() {
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

  private renderField(color: string, col: number, row: number) {
    const colorClass = color === "black" ? "black-field" : "white-field";
    return `<div class="chess-field ${colorClass}">${this.renderPiece(
      col,
      row
    )}</div>`;
  }

  private renderPiece(col: number, row: number) {
    const piece =
      col === 1 || col === 8
        ? new Piece(col, row, this.piecePattern[row - 1])
        : col === 2 || col === 7
        ? new Piece(col, row, "pawn")
        : "";
    if (piece) this.pieceState.push({ ...piece });
    return piece && piece.render();
  }
}

export default Board;
