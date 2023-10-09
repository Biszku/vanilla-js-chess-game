import Board from "./board/board";

class Game extends Board {
  selectedField: number[] | null = null;
  selectedPiece: HTMLElement | null | undefined = null;
  start() {
    this.addClickToFields();
  }

  addClickToFields() {
    const fields = document.querySelectorAll(".chess-field");

    fields.forEach((el) => {
      el.addEventListener("click", (e) => {
        this.selectField(
          this.boardState.get(e.currentTarget),
          e.target as HTMLElement
        );
      });
    });
  }

  selectField(cords: any, target: HTMLElement | null = null) {
    this.selectedField = this.selectedPiece && cords;
    this.selectedPiece ||= target?.closest("img");

    if (this.selectedField && this.selectedPiece) {
      target?.insertAdjacentElement("afterbegin", this.selectedPiece);
      this.selectedField = null;
      this.selectedPiece = null;
    }
    console.log(this.selectedField, this.selectedPiece);
  }
}

export default new Game();
