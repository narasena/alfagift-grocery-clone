import * as inventoryController from "../controllers/inventory.controller/inventory.controller";

const inventoryRouter = require("express").Router();

inventoryRouter.get('/all', inventoryController.getAllStocks)
inventoryRouter.get('/product/:slug', inventoryController.getStockByProductId)
inventoryRouter.get('/store/:storeId', inventoryController.getStockByStoreId)
inventoryRouter.put('/store/update-stocks/:storeId', inventoryController.updateProductStocksByStore)
inventoryRouter.get('/product/:slug/:storeId', inventoryController.getProductStockDetail)
inventoryRouter.put('/product/update-stock/:slug/:storeId', inventoryController.updateProductStockDetail)

export default inventoryRouter;