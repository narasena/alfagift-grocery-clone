import express from "express";
import { loginAdmin, registerAdmin, sessionLoginAdmin } from "../controllers/admin.controller";
import { requireSuperAdmin } from "../middlewares/requireSuperAdmin";
import { registerAdminValidator } from "../middlewares/express.validator/auth.validator";
import { errorValidatorHandler } from "../middlewares/express.validator/error.handler";
import { jwtDecode } from "../middlewares/jwt.decode";

const adminRouter = express.Router();

adminRouter.post("/register-admin", jwtDecode, requireSuperAdmin, registerAdminValidator, errorValidatorHandler, registerAdmin);
adminRouter.post("/login", loginAdmin);
adminRouter.get("/session-login", jwtDecode, sessionLoginAdmin);

export default adminRouter;
