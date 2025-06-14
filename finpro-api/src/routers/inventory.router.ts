import { getAllStocks, getStockByProductId } from "../controllers/inventory.controller/inventory.controller";

const inventoryRouter = require("express").Router();

inventoryRouter.get('/all', getAllStocks)
inventoryRouter.get('/product/:slug', getStockByProductId)

export default inventoryRouter;