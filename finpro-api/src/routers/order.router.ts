import { Router } from "express";
import { createOrder, getOrder } from "../controllers/order.controller";
import { jwtDecode } from "../middlewares/jwt.decode";

const orderRouter = Router();

orderRouter.post("/create", jwtDecode, createOrder);
orderRouter.get("/", jwtDecode, getOrder);

export default orderRouter;
