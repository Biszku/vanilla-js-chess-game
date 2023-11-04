export type PieceStateArr = {
  color: string;
  col: number;
  row: number;
  name: string;
  possibleMoves: [number, number, (string | undefined)?][];
  render: () => string;
  legalMoves: (pieceState: PieceStateArr) => void;
  changeCords: (cords: [number, number]) => void;
  setName: (name: string, pieceState: PieceStateArr) => void;
}[];

export type CoordinateTypes = {
  [prop: string]: string[];
};

export type singlePieceState = {
  color: string;
  col: number;
  row: number;
  name: string;
  possibleMoves: [number, number, (string | undefined)?][];
  render: () => string;
  legalMoves: (pieseState: PieceStateArr) => void;
  changeCords: (cords: [number, number]) => void;
  setName: (name: string, pieceState: PieceStateArr) => void;
};

export type selectedField = [number, number] | null;
