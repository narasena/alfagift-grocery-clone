import { fetchAllStores } from "@/controllers/store.controller/store.controller";

const allStoresRouter = require('express').Router();


allStoresRouter.get('/all', fetchAllStores)

export default allStoresRouter;