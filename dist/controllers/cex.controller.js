"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CexController = void 0;
const express_1 = require("express");
const cex_service_1 = require("../services/cex.service");
class CexController {
    constructor() {
        this.router = (0, express_1.Router)();
        this.getTicker = async (req, res, next) => {
            try {
                const exchangeName = req.query.exchange;
                const symbol = req.query.symbol;
                if (!exchangeName || !symbol) {
                    res.status(400).json({ error: "Missing 'exchange' or 'symbol' query params." });
                    return;
                }
                // Call the service
                const tickerData = await this.cexService.getTicker(exchangeName, symbol);
                // Send response
                res.json(tickerData);
            }
            catch (err) {
                next(err);
            }
        };
        this.cexService = new cex_service_1.CexService();
        this.initRoutes();
    }
    initRoutes() {
        // GET /cex/ticker?exchange=binance&symbol=BTC/USDT
        this.router.get("/ticker", this.getTicker);
    }
}
exports.CexController = CexController;
