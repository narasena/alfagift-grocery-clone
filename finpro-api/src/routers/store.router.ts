import { Router } from "express";
import {
  createStore,
  deleteStore,
  getAllStores,
  getStoreById,
  updateStoreById,
  assignStoreAdmin,
  getNearestStoreByAddress,
} from "../controllers/store.controller";

const storeRouter = Router();

storeRouter.post("/", createStore);
storeRouter.get("/all-store", getAllStores);
storeRouter.get("/:id", getStoreById);
storeRouter.put("/:id", updateStoreById);
storeRouter.delete("/:id", deleteStore);
storeRouter.post("/:id/assign-admin", assignStoreAdmin);
storeRouter.get("/nearest-by-address/:addressId", getNearestStoreByAddress);

export default storeRouter;
