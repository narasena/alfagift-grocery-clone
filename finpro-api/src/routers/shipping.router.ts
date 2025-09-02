import { Router } from "express";
import { getCityIdByName, getShippingCost } from "@/controllers/shipping.controller";

const shippingRouter = Router();

shippingRouter.post("/shipping-cost", getShippingCost);
shippingRouter.get("/city-id", getCityIdByName);

export default shippingRouter;