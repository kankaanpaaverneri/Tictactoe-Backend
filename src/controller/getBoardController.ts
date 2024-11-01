import { Request, Response, NextFunction } from "express";
import { board } from "../model/board";

export const getBoardController = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.status(200).json({
    board: board.board,
    winner: board.winner,
  });
};
