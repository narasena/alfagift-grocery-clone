import { Router } from "express";
import {
  createOrder,
  getOrderById,
  getOrderHistoryByStatus,
  getOrderPriceBreakdown,
} from "../controllers/order.controller";
import { jwtDecode } from "../middlewares/jwt.decode";

const orderRouter = Router();

orderRouter.post("/create", jwtDecode, createOrder);
orderRouter.get("/get/:orderId", jwtDecode, getOrderById);
orderRouter.get("/get-price-breakdown", jwtDecode, getOrderPriceBreakdown);
orderRouter.get("/by-status", jwtDecode, getOrderHistoryByStatus);

export default orderRouter;
