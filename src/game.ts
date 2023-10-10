import Board from "./board/board";

class Game extends Board {
  selectedField: number[] | null = null;
  selectedPiece: HTMLDivElement | null = null;
  selectedPieceCords: number[] | null = null;
  selectedPieceObj:
    | {
        color: string;
        curCol: number;
        curRow: number;
        name: string;
        render: () => string;
        legalMoves: () => number[][];
        changeCords: (cords: number[]) => void;
      }
    | null
    | undefined = null;
  currentPlayer = "white";

  start() {
    this.addClickToFields();
  }

  addClickToFields() {
    const fields = document.querySelectorAll(
      ".chess-field"
    )! as NodeListOf<HTMLDivElement>;

    fields.forEach((el) => {
      el.addEventListener("click", (e) => {
        this.selectField(
          this.boardState.get(e.currentTarget),
          e.target as HTMLDivElement
        );
      });
    });
  }

  selectField(cords: number[], target: HTMLDivElement) {
    if (!target?.closest("img"))
      this.selectedField = this.isFieldAvaible(cords);

    if (!this.selectedField) {
      const colorOfPiece =
        target?.closest("img")?.getAttribute("src")?.slice(0, 5) + "";
      if (colorOfPiece !== this.currentPlayer) return;

      this.selectedPiece = target?.closest("img");

      this.selectedPieceCords = this.selectedPiece && cords;

      const PieceObj = this.pieceState.find(
        (el) =>
          el.curCol === this.selectedPieceCords?.[0] &&
          el.curRow === this.selectedPieceCords?.[1]
      );

      this.selectedPieceObj = this.selectedPieceCords && PieceObj;
    }

    if (this.selectedField && this.selectedPiece) {
      this.makeMove(target);
      this.resetChooseFieldAndPiece();
    }
  }

  isFieldAvaible(cords: number[]) {
    if (!this.selectedPiece) return null;
    const legalMoves = this.selectedPieceObj
      ?.legalMoves()
      .map((el: number[]) => el.join(""));

    if (!legalMoves?.includes(cords.join(""))) return null;
    if (this.selectedPieceCords?.join("") === cords.join("")) return null;
    return cords;
  }

  makeMove(piece: HTMLDivElement) {
    this.selectedField &&
      this.selectedPieceObj?.changeCords(this.selectedField);
    if (!this.selectedPiece) return;
    piece.insertAdjacentElement("afterbegin", this.selectedPiece);
    this.resetChooseFieldAndPiece();
    this.changePlayer();
  }

  changePlayer() {
    this.currentPlayer = this.currentPlayer === "white" ? "black" : "white";
  }

  resetChooseFieldAndPiece() {
    this.selectedField = null;
    this.selectedPiece = null;
    this.selectedPieceCords = null;
    this.selectedPieceObj = null;
  }
}

export default new Game();
