import { Router } from "express";
import { createOrder, getOrderPriceBreakdown } from "../controllers/order.controller";
import { jwtDecode } from "../middlewares/jwt.decode";

const orderRouter = Router();

orderRouter.post("/create", jwtDecode, createOrder);
// orderRouter.get("/", jwtDecode, getOrder);
orderRouter.get("/get-price-breakdown", jwtDecode, getOrderPriceBreakdown);

export default orderRouter;
