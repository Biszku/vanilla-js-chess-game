import Board from "./board/board";
import { singlePieceState } from "./lib/definitions";
import { selectedField } from "./lib/definitions";

class Game extends Board {
  private selectedField: selectedField = null;
  private selectedPiece: HTMLDivElement | null = null;
  private selectedPieceObj: singlePieceState | null | undefined = null;
  private currentPlayer = "white";
  private curPlayerOutput = document.querySelector(
    ".cur-player-output"
  )! as HTMLSpanElement;
  private gameState = false;

  start() {
    this.gameState = true;
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

  selectField(cords: [number, number], target: HTMLDivElement) {
    if (!this.gameState) return;
    this.selectedField = this.isFieldAvaible(cords);

    if (!this.selectedField) {
      const [col, row] = cords;
      const piece = this.pieceState.find(
        (piece) => piece.col === col && piece.row === row
      );

      if (!piece) return;
      if (piece.color !== this.currentPlayer) return;

      this.removeMarker();
      this.selectedPiece = target?.closest("img");
      this.selectedPieceObj = piece;
      this.showMarkerOnAvailableFields();
    }

    if (this.selectedField && this.selectedPiece) {
      this.makeMove(target.closest(".chess-field")!);
      this.removeMarker();
      this.resetChooseFieldAndPiece();
    }
  }

  isFieldAvaible(cords: [number, number]) {
    if (!this.selectedPieceObj) return null;

    const legalMoves = this.selectedPieceObj.possibleMoves;

    const isMoveLegal = legalMoves
      .map((arr) =>
        arr.filter((onlyNumbersArr) => typeof onlyNumbersArr !== "string")
      )
      .map((el) => el.join(""))
      .includes(cords.join(""));

    if (!isMoveLegal) return null;
    return cords;
  }

  makeMove(field: HTMLDivElement) {
    if (!this.selectedPiece) return;

    const isKingCaptured = this.pieceState.find(
      (piece) =>
        piece.col === this.selectedField?.[0] &&
        piece.row === this.selectedField?.[1]
    );

    if (isKingCaptured?.name === "king") {
      this.curPlayerOutput.textContent = this.currentPlayer + " won the game!";
      this.gameState = false;
    }

    this.pieceState = this.pieceState.filter(
      (el) =>
        el.col !== this.selectedField?.[0] || el.row !== this.selectedField?.[1]
    );

    field.innerHTML = "";
    this.selectedField &&
      this.selectedPieceObj?.changeCords(this.selectedField);

    this.updatePossibleMoves();

    field.insertAdjacentElement("afterbegin", this.selectedPiece);
    if (
      (this.selectedPieceObj?.row === 8 || this.selectedPieceObj?.row === 1) &&
      this.selectedPieceObj.name === "pawn"
    )
      this.swapPiece(field);
    if (!this.gameState) return;
    this.resetChooseFieldAndPiece();
    this.changePlayer();
  }

  updatePossibleMoves() {
    this.pieceState.forEach((el) => el.legalMoves(this.pieceState));
  }

  swapPiece(piece: HTMLDivElement) {
    this.selectedPieceObj?.setName("queen", this.pieceState);
    if (this.selectedPieceObj)
      piece.innerHTML = this.selectedPieceObj?.render();
  }

  showMarkerOnAvailableFields() {
    const possibleMoves = this.selectedPieceObj?.possibleMoves;

    possibleMoves?.forEach((arr) => {
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
    this.selectedPieceObj = null;
  }
}

export default new Game();
