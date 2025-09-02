import { Router } from "express";
import {
  deleteCartItem,
  getCartItems,
  createCartItems,
  deleteAllCartItems,
  updateCartItemQuantity,
} from "@/controllers/cart.controller";
import { jwtDecode } from "@/middlewares/jwt.decode";

const cartRouter = Router();

cartRouter.get("/:storeId", jwtDecode, getCartItems);
// cartRouter.post("/add", jwtDecode, createCartItems);
cartRouter.post("/:storeId/add", jwtDecode, createCartItems);
cartRouter.put("/:cartItemId/delete", jwtDecode, deleteCartItem);
cartRouter.put("/delete-all", jwtDecode, deleteAllCartItems);
cartRouter.put("/item/:cartItemId/product/:productId/store/:storeId/update-qty", jwtDecode, updateCartItemQuantity);
// cartRouter.put("/:cartItemId/update-qty", jwtDecode, updateCartItemQuantity);

export default cartRouter;
