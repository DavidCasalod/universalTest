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
                const tokenId = req.query.tokenId; // <-- NEW
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
                // Sends the response
                res.json(quote);
            }
            catch (err) {
                next(err);
            }
        };
        // New endpoint arrow function
        this.gaugeDetails = async (req, res, next) => {
            try {
                const gaugeAddress = req.query.gauge;
                if (!gaugeAddress) {
                    res.status(400).json({ error: "Missing 'gauge' query param." });
                    return;
                }
                // Call getGaugeDetails
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
                    // Instead of `return res.status(400).json(...)`
                    res.status(400).json({
                        error: "Missing 'tokenA', 'tokenB', or 'liquidity' query params."
                    });
                    return; // <--- return void, no Response
                }
                const result = await this.aerodromeService.quoteRemoveLiquidity(tokenA, tokenB, liquidity);
                // Simply call res.json(...) and then return
                res.json(result);
                return; // <--- again, return void
            }
            catch (err) {
                next(err);
            }
        };
        this.addLiquidityMock = async (req, res, next) => {
            try {
                const { tokenA, tokenB, amountA, amountB, user } = req.query;
                if (!tokenA || !tokenB || !amountA || !amountB || !user) {
                    res.status(400).json({
                        error: "Missing 'tokenA', 'tokenB', 'amountA', 'amountB' or 'user' query params."
                    });
                    return;
                }
                // Calls the mock function in the service
                const mockResult = await this.aerodromeService.addLiquidityMock(tokenA, tokenB, amountA, amountB, user);
                // Returns the simulated result
                res.json(mockResult);
            }
            catch (err) {
                next(err);
            }
        };
        this.aerodromeService = new aerodrome_service_1.AerodromeService();
        this.initRoutes();
    }
    initRoutes() {
        this.router.get("/rewards", this.getRewards);
        this.router.get("/quoteAddLiquidity", this.quoteAddLiquidity);
        this.router.get("/quoteRemoveLiquidity", this.quoteRemoveLiquidity);
        this.router.get("/gaugeDetails", this.gaugeDetails);
        this.router.get("/addLiquidityMock", this.addLiquidityMock);
    }
}
exports.LiquidityController = LiquidityController;
