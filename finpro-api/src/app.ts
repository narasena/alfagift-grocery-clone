import express, { json, urlencoded, Express, Request, Response, NextFunction, Router } from "express";
import cors from "cors";
import { PORT } from "./config";
import { ProductCategoryRouter } from "./routers/product.category.router";
import { ProductRouter } from "./routers/product.router";
import cartRouter from "./routers/cart.router";
import orderRouter from "./routers/order.router";
import authRouter from "./routers/auth.router";
import getMapRouter from "./routers/getMap.router";
import storeRouter from './routers/store.router';
import inventoryRouter from './routers/inventory.router';

export default class App {
  private app: Express;

  constructor() {
    this.app = express();
    this.configure();
    this.routes();
    this.handleError();
  }

  private configure(): void {
    this.app.use(cors());
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
  }

  private handleError(): void {
    // Not Found Handler
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.path.includes("/api/")) {
        res
          .status(404)
          .send(
            "We are sorry, the endpoint you are trying to access could not be found on this server. Please ensure the URL is correct!",
          );
      } else {
        next();
      }
    });

    // Error Handler
    this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      if (req.path.includes("/api/")) {
        console.error("Error : ", err);
        res.status(500).json({
          success: false,
          message: "Internal server error. Please try again later!",
        });
      } else {
        next();
      }
    });
  }

  private routes(): void {
    const productCategoryRouter = new ProductCategoryRouter();
    const productRouter = new ProductRouter();

    this.app.get("/api", (req: Request, res: Response) => {
      res.send(`<h1>Hello, This is FINPRO-JCWD3202 API!</h1>`);
    });

    //tambahin router di sini
    this.app.use("/api/product", productRouter.getRouter());
    this.app.use("/api/product-category", productCategoryRouter.getRouter());
    this.app.use("/api/user", authRouter);
    this.app.use("/api", getMapRouter);
    this.app.use("/api/cart", cartRouter);
    this.app.use("/api/order", orderRouter);
    this.app.use('/api/store', storeRouter)
    this.app.use('/api/inventories', inventoryRouter)
  }

  public start(): void {
    if (process.env.NODE_ENV !== "production") {
      this.app.listen(PORT, () => {
        console.log(`  🖥️ [API] Local:   http://localhost:${PORT}/`);
      });
    }
  }

  // Add this getter method
  public getApp(): Express {
    return this.app;
  }
}
