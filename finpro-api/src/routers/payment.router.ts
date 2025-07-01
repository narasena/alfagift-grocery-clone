import { createPayment, createPaymentImage } from "../controllers/payment.controller";
import { jwtDecode } from "../middlewares/jwt.decode";
import { Router } from "express";

const paymentRouter = Router();

paymentRouter.post("/:orderId/create", jwtDecode, createPayment);
paymentRouter.post("/create-image", jwtDecode, createPaymentImage);

export default paymentRouter;
