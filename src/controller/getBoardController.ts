import express, { Request, Response, NextFunction } from "express";
import { board } from "../model/board";

export const getBoardController = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log("Terve");
  res.status(200).json({
    board: board.board,
  });
};
