import { Router } from "express";
import * as adminController from "../controllers/admin.controller/admin.controller";

const adminRouter = Router();

adminRouter.get('/', adminController.getAllAdmins)

export default adminRouter;