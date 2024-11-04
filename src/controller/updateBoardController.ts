import { Request, Response } from "express";
import { isUpdateBoardRequestValid } from "../util/isRequestValid";
import { BoardSquareState, board, WinningStatus } from "../model/board";

export const updateBoardController = (req: Request, res: Response) => {
  if (!isUpdateBoardRequestValid(req.body)) {
    res
      .status(500)
      .json("Request invalid: Request must contain id between 1 and 9");
  }
  const playerMoveid: number = req.body.id;

  board.updateBoardWithId(playerMoveid);
  if (board.readWinningStatus() === WinningStatus.NO_WINNER) {
    board.switchTurn();
    board.programMove(playerMoveid);
    board.readWinningStatus();
    board.switchTurn();
  }

  res.status(200).json({ message: "Update success" });
};
