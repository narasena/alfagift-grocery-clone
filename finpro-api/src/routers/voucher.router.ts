import { Router } from "express";
import * as voucherController from '../controllers/voucher.controller/voucher.controller'
import { jwtDecode } from "../middlewares/jwt.decode";

const voucherRouter = Router();

voucherRouter.get('/user', jwtDecode, voucherController.getUserVouchers)

export default voucherRouter;