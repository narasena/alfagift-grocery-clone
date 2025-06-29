import * as userController from "../controllers/user.controller/user.controller";

const userRouter = require("express").Router();

userRouter.get("/", userController.getAllUsers);

export default userRouter;
