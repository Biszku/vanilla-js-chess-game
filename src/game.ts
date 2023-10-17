import Board from "./board/board";
import { PieceStateArr } from "./board/board";

type singlePieceState = {
  color: string;
  curCol: number;
  curRow: number;
  name: string;
  render: () => string;
  legalMoves: (pieseState: PieceStateArr) => [number, number, string?][] | [];
  changeCords: (cords: [number, number]) => void;
  setName: (name: string) => void;
};

class Game extends Board {
  private selectedField:
    | (string | number | undefined)[]
    | [number, number, string?]
    | null = null;
  private selectedPiece: HTMLDivElement | null = null;
  private selectedPieceCords: number[] | null = null;
  private selectedPieceObj: singlePieceState | null | undefined = null;
  private currentPlayer = "white";
  private curPlayerOutput = document.querySelector(
    ".cur-player-output"
  )! as HTMLSpanElement;

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
    this.selectedField = this.isFieldAvaible(cords);

    if (!this.selectedField) {
      const colorOfPiece =
        target?.closest("img")?.getAttribute("src")?.slice(0, 5) + "";

      if (colorOfPiece !== this.currentPlayer) return;

      this.removeMarker();
      this.selectedPiece = target?.closest("img");
      this.selectedPieceCords = this.selectedPiece && cords;

      const PieceObj = this.pieceState.find(
        (el) =>
          el.curCol === this.selectedPieceCords?.[0] &&
          el.curRow === this.selectedPieceCords?.[1]
      );

      this.selectedPieceObj = this.selectedPieceCords && PieceObj;

      this.showMarkerOnAvailableFields();
    }

    if (this.selectedField && this.selectedPiece) {
      this.makeMove(target.closest(".chess-field")!);
      this.removeMarker();
      this.resetChooseFieldAndPiece();
    }
  }

  isFieldAvaible(cords: number[]) {
    if (!this.selectedPieceObj) return null;

    const legalMoves = this.selectedPieceObj.legalMoves(this.pieceState);

    const isMoveLegal = legalMoves
      .map((arr) =>
        arr.filter((onlyNumbersArr) => typeof onlyNumbersArr !== "string")
      )
      .map((el) => el.join(""))
      .includes(cords.join(""));

    if (!isMoveLegal) return null;

    const filteredLegalMovesArr = legalMoves
      .filter(
        (movesArr) => movesArr[0] === cords[0] && movesArr[1] === cords[1]
      )
      .flat(2);

    return filteredLegalMovesArr;
  }

  makeMove(piece: HTMLDivElement) {
    if (!this.selectedPiece) return;
    console.log(this.pieceState);

    this.pieceState = this.pieceState.filter(
      (el) =>
        el.curCol !== this.selectedField?.[0] ||
        el.curRow !== this.selectedField?.[1]
    );

    piece.innerHTML = "";
    this.selectedField &&
      this.selectedPieceObj?.changeCords(
        this.selectedField.slice(0, 2) as [number, number]
      );

    piece.insertAdjacentElement("afterbegin", this.selectedPiece);
    if (
      this.selectedPieceObj?.curRow === 8 ||
      this.selectedPieceObj?.curRow === 1
    )
      this.swapPiece(piece);
    this.resetChooseFieldAndPiece();
    this.changePlayer();
  }

  swapPiece(piece: HTMLDivElement) {
    this.selectedPieceObj?.setName("queen");
    if (this.selectedPieceObj)
      piece.innerHTML = this.selectedPieceObj?.render();
  }

  showMarkerOnAvailableFields() {
    const Fields = this.selectedPieceObj?.legalMoves(this.pieceState);

    Fields?.forEach((arr) => {
      const [col, row, isAttack] = arr;
      const cords = [col, row];
      const field = this.boardStateByCords.get(
        cords.join("")
      ) as HTMLDivElement;
      if (isAttack) return field.classList.add("isAttacking");
      const markup = document.createElement("div");
      markup.className = "legal-field";
      field.insertAdjacentElement("afterbegin", markup);
    });
  }

  removeMarker() {
    document.querySelectorAll(".legal-field").forEach((el) => el.remove());
    document
      .querySelectorAll(".isAttacking")
      .forEach((el) => el.classList.remove("isAttacking"));
  }

  changePlayer() {
    this.currentPlayer = this.currentPlayer === "white" ? "black" : "white";
    this.curPlayerOutput.textContent = this.currentPlayer + " turn";
  }

  resetChooseFieldAndPiece() {
    this.selectedField = null;
    this.selectedPiece = null;
    this.selectedPieceCords = null;
    this.selectedPieceObj = null;
  }
}

export default new Game();
