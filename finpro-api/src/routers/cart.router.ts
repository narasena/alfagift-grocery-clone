import { Router } from "express";
// import { deleteCartItem, getCartItems, createCartItems, deleteAllCartItems } from "../controllers/cart.controller";
import { createCartItems } from "../controllers/cart.controller";
import { getCartItems } from "../controllers/cart.controller";
import { deleteAllCartItems } from "../controllers/cart.controller";
const cartRouter = Router();

cartRouter.get("/", getCartItems);
cartRouter.post("/add", createCartItems);
// cartRouter.put("/:id/delete", deleteCartItem); //hrs pake slug? //delete atau put?
cartRouter.put("/delete-all", deleteAllCartItems);

export default cartRouter;
