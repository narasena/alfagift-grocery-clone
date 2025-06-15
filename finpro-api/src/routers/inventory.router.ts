import { getAllStocks, getProductStockDetail, getStockByProductId, getStockByStoreId } from "../controllers/inventory.controller/inventory.controller";

const inventoryRouter = require("express").Router();

inventoryRouter.get('/all', getAllStocks)
inventoryRouter.get('/product/:slug', getStockByProductId)
inventoryRouter.get('/store/:storeId', getStockByStoreId)
inventoryRouter.get('/product/:slug/:storeId', getProductStockDetail)

export default inventoryRouter;