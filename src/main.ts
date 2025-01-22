import express, { Request, Response, NextFunction } from "express";
import { LiquidityController } from "./controllers/aerodrome.controller";
import { OnChainController } from "./controllers/universal-onchain.controller";
import { CexController } from "./controllers/cex.controller";

async function bootstrap() {
  const app = express();
  app.use(express.json());

  const onChainController = new OnChainController();

  // Define a regular handler without returning the Response
  app.get("/owner", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ownerAddress = await onChainController.getOwner();
      // Call res.json(...) and DO NOT return its value
      res.json({ owner: ownerAddress });
    } catch (err) {
      next(err);
    }
  });

  const liquidityController = new LiquidityController();
  app.use("/liquidity", liquidityController.router);

  // Instantiate the CEX controller
  const cexController = new CexController();
  // Mount its routes on /cex
  app.use("/cex", cexController.router);

  // (Optional) error handling middleware
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

bootstrap().catch(err => {
  console.error("Error starting app:", err);
  process.exit(1);
});
