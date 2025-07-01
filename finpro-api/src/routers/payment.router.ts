import { createPayment } from "../controllers/payment.controller";
import { jwtDecode } from "../middlewares/jwt.decode";
import { Router } from "express";

const paymentRouter = Router();

paymentRouter.post("/create", jwtDecode, createPayment);

export default paymentRouter;
