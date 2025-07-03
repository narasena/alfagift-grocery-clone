import {
  acceptOrRejectPayment,
  createPayment,
  createPaymentImage,
  getPaymentImageUrl,
  getPendingPayments,
} from "../controllers/payment.controller";
import { jwtDecode } from "../middlewares/jwt.decode";
import { Router } from "express";

const paymentRouter = Router();

paymentRouter.post("/:orderId/create", jwtDecode, createPayment);
paymentRouter.post("/create-image", jwtDecode, createPaymentImage);
paymentRouter.get("/pending-users", getPendingPayments);
paymentRouter.get("/:paymentId/proof-url", getPaymentImageUrl);
paymentRouter.post("/:paymentId/verify", acceptOrRejectPayment);
paymentRouter.get("/sales-report", getSalesReport);

export default paymentRouter;
