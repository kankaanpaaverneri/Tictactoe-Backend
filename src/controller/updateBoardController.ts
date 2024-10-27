import { Request, Response, NextFunction } from "express";
import isRequestValid from "../util/isRequestValid";
import { BoardSquareState, board } from "../model/board";

export const updateBoardController = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let message: string = "";
  if (!isRequestValid(req.body)) {
    res
      .status(500)
      .json("Request invalid: Request must contain id between 1 and 9");
  }

  const id: number = req.body.id;

  board.updateBoardWithId(id);
  board.switchTurn();
  board.programMove();
  board.switchTurn();
  res.status(200).json({ message: "Update success" });
};
