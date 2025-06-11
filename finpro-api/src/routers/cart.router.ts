import { Router } from "express";
import { deleteCartItem, getCartItems, createCartItems, deleteAllCartItems } from "@/controllers/cart.controller";

const cartRouter = Router();

cartRouter.get("/", getCartItems);
cartRouter.post("/add", createCartItems);
cartRouter.delete("/delete", deleteCartItem); //hrs pake slug? //delete atau put?
cartRouter.delete("/delete-all-cart-items", deleteAllCartItems);

export default cartRouter;
