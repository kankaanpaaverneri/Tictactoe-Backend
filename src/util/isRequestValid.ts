import { BoardSquareState } from "../model/board";

export default function isRequestValid(body: any): boolean {
  let requestValid: boolean = false;
  requestValid = body?.id >= 1 && body?.id <= 9 ? true : false;

  return requestValid;
}
