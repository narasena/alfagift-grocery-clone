import { createDiscount } from "../controllers/discount.controller/discount.controller";
import { Router } from "express";

const discountRouter = Router()

discountRouter.post('/create',createDiscount)

export default discountRouter