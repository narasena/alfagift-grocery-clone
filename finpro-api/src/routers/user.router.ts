
import { changeEmail, getUserProfile, updateUserProfile, verifyEmail } from "../controllers/user.controller";
import { Router } from "express";
const userRouter = Router();


userRouter.get("/profile", getUserProfile);
userRouter.put("/profile/:email", updateUserProfile);
userRouter.put("/change-email", changeEmail);
userRouter.get("/verify-email", verifyEmail);



export default userRouter;