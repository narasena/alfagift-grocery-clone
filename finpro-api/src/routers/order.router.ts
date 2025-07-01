import { Router } from "express";
import { createOrder, getOrderById, getOrderPriceBreakdown } from "../controllers/order.controller";
import { jwtDecode } from "../middlewares/jwt.decode";

const orderRouter = Router();

orderRouter.post("/create", jwtDecode, createOrder);
orderRouter.get("/get-order/:orderId", jwtDecode, getOrderById);
orderRouter.get("/get-price-breakdown", jwtDecode, getOrderPriceBreakdown);

export default orderRouter;
