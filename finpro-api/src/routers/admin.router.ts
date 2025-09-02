import express from "express";
import { getAllAdmins, loginAdmin, registerAdmin, sessionLoginAdmin, updateAdminStore } from "@/controllers/admin.controller";
import { requireSuperAdmin } from "@/middlewares/requireSuperAdmin";
import { registerAdminValidator } from "@/middlewares/express.validator/auth.validator";
import { errorValidatorHandler } from "@/middlewares/express.validator/error.handler";
import { jwtDecode } from "@/middlewares/jwt.decode";
import * as adminController from "@/controllers/admin.controller/admin.controller";

const adminRouter = express.Router();

adminRouter.post("/register-admin", jwtDecode, requireSuperAdmin, registerAdminValidator, errorValidatorHandler, registerAdmin);
// adminRouter.post("/register-admin", registerAdmin);
adminRouter.post("/login", loginAdmin);
adminRouter.get("/session-login", jwtDecode, sessionLoginAdmin);
adminRouter.get('/', adminController.getAllAdmins)
adminRouter.get("/all", jwtDecode, getAllAdmins);
adminRouter.put(
  "/:adminId/update-store",
  jwtDecode,
  requireSuperAdmin,
  updateAdminStore
);


export default adminRouter;