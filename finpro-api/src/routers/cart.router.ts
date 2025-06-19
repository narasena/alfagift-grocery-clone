import { Router } from "express";
import {
  deleteCartItem,
  getCartItems,
  createCartItems,
  deleteAllCartItems,
  updateCartItemQuantity,
} from "../controllers/cart.controller";

const cartRouter = Router();

cartRouter.get("/", getCartItems);
cartRouter.post("/add", createCartItems);
cartRouter.put("/:cartItemId/delete", deleteCartItem);
cartRouter.put("/delete-all", deleteAllCartItems);
cartRouter.put("/:cartItemId/update-qty", updateCartItemQuantity);

export default cartRouter;
