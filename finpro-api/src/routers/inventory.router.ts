import { getAllStocks, getStockByProductId, getStockByStoreId } from "../controllers/inventory.controller/inventory.controller";

const inventoryRouter = require("express").Router();

inventoryRouter.get('/all', getAllStocks)
inventoryRouter.get('/product/:slug', getStockByProductId)
inventoryRouter.get('/store/:storeId', getStockByStoreId)

export default inventoryRouter;