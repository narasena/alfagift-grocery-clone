// routes/userAddressRoutes.ts
import express from "express";
import {
  createUserAddress,
  updateUserAddress,
  deleteUserAddress,
  setMainAddress,
  getUserAddresses,
  selectUserAddresses,
} from "../controllers/address.controller";
import { jwtDecode } from "../middlewares/jwt.decode";

const addressRouter = express.Router();

addressRouter.get("/user-addresses", jwtDecode,selectUserAddresses);
addressRouter.get("/:userId", getUserAddresses);
addressRouter.post("/", createUserAddress);
addressRouter.put("/:id", updateUserAddress);
addressRouter.delete("/:id", deleteUserAddress);
addressRouter.patch("/set-main/:id", setMainAddress);


export default addressRouter;
