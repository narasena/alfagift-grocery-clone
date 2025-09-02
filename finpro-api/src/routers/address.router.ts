// routes/userAddressRoutes.ts
import express from "express";
import {
  createUserAddress,
  updateUserAddress,
  deleteUserAddress,
  setMainAddress,
  getUserAddresses,
  selectUserAddresses,
  getAddressById,
  updateAddressById,
  
} from "@/controllers/address.controller";
import { jwtDecode } from "@/middlewares/jwt.decode";

const addressRouter = express.Router();

addressRouter.get("/user-addresses", jwtDecode,selectUserAddresses);
addressRouter.get("/:userId", getUserAddresses);
addressRouter.post("/", createUserAddress);
addressRouter.put("/:id", updateUserAddress);
addressRouter.delete("/:id", deleteUserAddress);
addressRouter.put("/:id", getAddressById);
addressRouter.put("/:id", updateAddressById);


export default addressRouter;