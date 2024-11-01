import { Request, Response } from "express";
import { board } from "../model/board";

export const resetBoardController = (req: Request, res: Response) => {
  console.log("RESET");
  board.resetBoard();
  res.status(200).json({
    winner: board.winner,
  });
};
