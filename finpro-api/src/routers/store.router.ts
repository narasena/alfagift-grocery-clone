import { getAllStores } from "../controllers/store.controller/store.controller";
import { Router } from "express";

const storeRouter = Router()

storeRouter.get('/all', getAllStores)


export default storeRouter