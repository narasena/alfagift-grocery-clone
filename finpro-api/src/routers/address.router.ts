// routes/userAddressRoutes.ts
import express from "express";
import {
  createUserAddress,
  updateUserAddress,
  deleteUserAddress,
  setMainAddress,
  getUserAddresses,
} from "../controllers/address.controller";

const addressRouter = express.Router();

addressRouter.get("/:userId", getUserAddresses);
addressRouter.post("/", createUserAddress);
addressRouter.put("/:id", updateUserAddress);
addressRouter.delete("/:id", deleteUserAddress);
addressRouter.patch("/set-main/:id", setMainAddress);

export default addressRouter;
