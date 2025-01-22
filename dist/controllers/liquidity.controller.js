"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiquidityController = void 0;
const express_1 = require("express");
const aerodrome_service_1 = require("../services/aerodrome.service");
class LiquidityController {
    constructor() {
        this.router = (0, express_1.Router)();
        this.getRewards = async (req, res, next) => {
            try {
                const gaugeAddress = req.query.gauge;
                const userAddress = req.query.user;
                const tokenId = req.query.tokenId; // <-- NUEVO
                if (!gaugeAddress || !userAddress || !tokenId) {
                    res.status(400).json({ error: "Missing 'gauge', 'user', or 'tokenId' query params." });
                    return;
                }
                const rewards = await this.aerodromeService.getRewardsInfo(gaugeAddress, userAddress, tokenId);
                res.json(rewards);
            }
            catch (err) {
                next(err);
            }
        };
        this.quoteAddLiquidity = async (req, res, next) => {
            try {
                const { tokenA, tokenB, amountA, amountB } = req.query;
                if (!tokenA || !tokenB || !amountA || !amountB) {
                    res.status(400).json({ error: "Missing 'tokenA', 'tokenB', 'amountA', 'amountB' query params." });
                    return;
                }
                const quote = await this.aerodromeService.quoteAddLiquidity(tokenA, tokenB, amountA, amountB);
                // Envías la respuesta
                res.json(quote);
            }
            catch (err) {
                next(err);
            }
        };
        // Nuevo endpoint arrow function
        this.gaugeDetails = async (req, res, next) => {
            try {
                const gaugeAddress = req.query.gauge;
                if (!gaugeAddress) {
                    res.status(400).json({ error: "Missing 'gauge' query param." });
                    return;
                }
                // Llamar a getGaugeDetails
                const details = await this.aerodromeService.getGaugeDetails(gaugeAddress);
                res.json(details);
            }
            catch (err) {
                next(err);
            }
        };
        this.quoteRemoveLiquidity = async (req, res, next) => {
            try {
                const { tokenA, tokenB, liquidity } = req.query;
                if (!tokenA || !tokenB || !liquidity) {
                    // En lugar de `return res.status(400).json(...)`
                    res.status(400).json({
                        error: "Missing 'tokenA', 'tokenB', or 'liquidity' query params."
                    });
                    return; // <--- devolvemos void, no devolvemos el Response
                }
                const result = await this.aerodromeService.quoteRemoveLiquidity(tokenA, tokenB, liquidity);
                // Simplemente llamamos res.json(...) y luego return
                res.json(result);
                return; // <--- de nuevo, devolvemos void
            }
            catch (err) {
                next(err);
            }
        };
        this.aerodromeService = new aerodrome_service_1.AerodromeService();
        this.initRoutes();
    }
    initRoutes() {
        // Registramos los handlers sin bind, 
        this.router.get("/rewards", this.getRewards);
        this.router.get("/quoteAddLiquidity", this.quoteAddLiquidity);
        // Nuevo endpoint: /gaugeDetails
        this.router.get("/quoteRemoveLiquidity", this.quoteRemoveLiquidity);
        this.router.get("/gaugeDetails", this.gaugeDetails);
    }
}
exports.LiquidityController = LiquidityController;
