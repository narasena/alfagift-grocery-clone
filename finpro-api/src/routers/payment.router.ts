import { jwtDecode } from "../middlewares/jwt.decode";
import { Router } from "express";
import { createPayment } from "@/controllers/payment.controller";

const paymentRouter = Router();

paymentRouter.post("/create", jwtDecode, createPayment);

export default paymentRouter;
