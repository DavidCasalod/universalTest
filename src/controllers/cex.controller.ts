import { Router, Request, Response, NextFunction, RequestHandler } from "express";
import { CexService } from "../services/cex.service";

export class CexController {
  public router = Router();
  private cexService: CexService;

  constructor() {
    this.cexService = new CexService();
    this.initRoutes();
  }

  private initRoutes(): void {
    // GET /cex/ticker?exchange=binance&symbol=BTC/USDT
    this.router.get("/ticker", this.getTicker);
  }

  private getTicker: RequestHandler = async (req, res, next) => {
    try {
      const exchangeName = req.query.exchange as string;
      const symbol = req.query.symbol as string;

      if (!exchangeName || !symbol) {
        res.status(400).json({ error: "Missing 'exchange' or 'symbol' query params." });
        return;
      }

      // Call the service
      const tickerData = await this.cexService.getTicker(exchangeName, symbol);

      // Send response
      res.json(tickerData);
    } catch (err) {
      next(err);
    }
  };
}
