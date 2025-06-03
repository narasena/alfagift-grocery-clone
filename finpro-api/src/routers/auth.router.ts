import { Router } from "express";
const authRouter = Router();
import { registerUser } from "../controllers/auth.controller";

authRouter.post("/register", registerUser);

export default authRouter;