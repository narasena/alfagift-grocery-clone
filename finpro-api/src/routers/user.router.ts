
import { getAllUsers } from "../controllers/user.controller/user.controller";
import { changeEmail, getUserProfile, updateUserProfile, verifyEmail } from "../controllers/user.controller";
import { Router } from "express";
const userRouter = Router();


userRouter.get("/profile", getUserProfile);
userRouter.put("/profile/:email", updateUserProfile);
userRouter.put("/change-email", changeEmail);
userRouter.get("/verify-email", verifyEmail);
userRouter.get('/all',getAllUsers)



export default userRouter;