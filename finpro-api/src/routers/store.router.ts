import { Router } from "express";
import {
  createStore,
  deleteStore,
  getAllStores,
  getStoreById,
  updateStoreById,
  assignStoreAdmin,
} from "../controllers/store.controller";
import { requireSuperAdmin } from "../middlewares/requireSuperAdmin";
import { sessionLoginAdmin } from "../controllers/admin.controller";
import { jwtDecode } from "../middlewares/jwt.decode";

const storeRouter = Router();

// storeRouter.use(requireSuperAdmin); // Semua route hanya bisa diakses SuperAdmin

storeRouter.post("/", createStore);
storeRouter.get("/all-store", getAllStores);
storeRouter.get("/:id", getStoreById);
storeRouter.put("/:id", updateStoreById);
storeRouter.delete("/:id", deleteStore);
storeRouter.post("/:id/assign-admin", assignStoreAdmin);

export default storeRouter;
