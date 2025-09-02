import { createDiscount } from "@/controllers/discount.controller/discount.controller";
import { Router } from "express";
import * as discountController from "@/controllers/discount.controller/discount.controller";

const discountRouter = Router()

discountRouter.post('/create', createDiscount)
discountRouter.get('/all',discountController.getDiscounts)

export default discountRouter