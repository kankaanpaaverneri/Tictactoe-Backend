import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

import boardRoutes from "./routes/boardRoutes";

app.use("/", boardRoutes);

app.listen(port, () => {
  console.log("listening...");
});
