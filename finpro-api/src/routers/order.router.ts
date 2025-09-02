import { Router } from "express";
import {
  createOrder,
  getOrderById,
  getOrderDetails,
  getOrderHistoryByStatus,
  getOrderPriceBreakdown,
} from "@/controllers/order.controller";
import { jwtDecode } from "@/middlewares/jwt.decode";

const orderRouter = Router();

orderRouter.post("/create", jwtDecode, createOrder);
orderRouter.get("/get/:orderId", jwtDecode, getOrderById);
orderRouter.get("/get-price-breakdown", jwtDecode, getOrderPriceBreakdown);
orderRouter.get("/by-status", jwtDecode, getOrderHistoryByStatus);
orderRouter.get("/details/:orderId", jwtDecode, getOrderDetails);

export default orderRouter;
