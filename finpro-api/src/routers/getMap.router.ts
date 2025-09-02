import express from "express";
import { getMapHandler } from "@/controllers/map.controller";

const getMapRouter = express.Router();

getMapRouter.get("/", getMapHandler);

export default getMapRouter;
