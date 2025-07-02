import { Router } from "express";
const authRouter = Router();
import { confirmResetPassword, loginUser, registerUser, registerWithEmailOnly, sendResetPasswordEmail, sessionLoginUser, verifyEmail } from "../controllers/auth.controller";
import { registerUserValidator } from "../middlewares/express.validator/auth.validator";
import { errorValidatorHandler } from "../middlewares/express.validator/error.handler";
import { jwtDecode } from "../middlewares/jwt.decode";

authRouter.post("/register", registerUserValidator, errorValidatorHandler, registerUser);
authRouter.post("/login", loginUser);
authRouter.get("/session-login", jwtDecode, sessionLoginUser);
authRouter.post("/register-email-only", registerWithEmailOnly);
authRouter.get("/verify-email", verifyEmail);
authRouter.post("/reset-password", sendResetPasswordEmail);
authRouter.post("/confirm-reset-password", confirmResetPassword);

export default authRouter;