import { Request, Response } from "express";
import { isSetMarksRequestValid, Marks } from "../util/isRequestValid";
import { board } from "../model/board";

export const setMarksController = (req: Request, res: Response): void => {
  // Validate req.body
  if (!isSetMarksRequestValid(req.body)) {
    res.status(500).json({ message: "Request invalid: Marks must be X or O" });
  }

  const { playerMark, programMark }: Marks = req.body;

  board.playerMark = playerMark;
  board.programMark = programMark;
  board.turn = playerMark;

  console.log("playerMark: ", playerMark);
  console.log("programMark: ", programMark);

  res.status(200).json({ message: "Setting marks success" });
};
