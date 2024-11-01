import { BoardSquareState } from "../model/board";

export interface Marks {
  playerMark: BoardSquareState;
  programMark: BoardSquareState;
}

export function isUpdateBoardRequestValid(body: any): boolean {
  let requestValid: boolean = false;
  requestValid = body?.id >= 1 && body?.id <= 9 ? true : false;

  return requestValid;
}

export function isSetMarksRequestValid(body: any): boolean {
  let requestValid: boolean = false;
  if (
    body?.playerMark === BoardSquareState.X ||
    body?.playerMark === BoardSquareState.O
  )
    requestValid = true;
  else requestValid = false;

  if (
    body?.programMark === BoardSquareState.X ||
    body?.programMark === BoardSquareState.O
  )
    requestValid = true;
  else requestValid = false;

  return requestValid;
}
