import { getAllStocks } from "../controllers/inventory.controller/inventory.controller";

const inventoryRouter = require("express").Router();

inventoryRouter.get('/all', getAllStocks)

export default inventoryRouter;