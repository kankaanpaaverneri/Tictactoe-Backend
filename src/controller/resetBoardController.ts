import { Request, Response, NextFunction } from "express";
import { board } from "../model/board";

export const resetBoardController = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log("RESET");
  board.resetBoard();
  res.status(200).json({ message: "Reset success" });
};
