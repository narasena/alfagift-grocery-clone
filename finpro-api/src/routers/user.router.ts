import { Router } from "express";
import { getUserAddresses } from "../controllers/user.controller";
import { jwtDecode } from "../middlewares/jwt.decode";

const userRouter = Router()

userRouter.get("/addresses", jwtDecode, getUserAddresses) 

export default userRouter