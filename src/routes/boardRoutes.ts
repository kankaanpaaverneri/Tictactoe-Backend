import express from "express";
import { getBoardController } from "../controller/getBoardController";
import { updateBoardController } from "../controller/updateBoardController";
import { resetBoardController } from "../controller/resetBoardController";
import { setMarksController } from "../controller/setMarksController";
const router = express.Router();

router.get("/get-board", getBoardController);
router.post("/update-board", updateBoardController);
router.get("/reset-board", resetBoardController);
router.post("/set-marks", setMarksController);

export default router;
