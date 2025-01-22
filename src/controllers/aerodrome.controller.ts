import { Router, Request, Response, NextFunction, RequestHandler } from "express";
import { AerodromeService } from "../services/aerodrome.service";

export class LiquidityController {
  public router = Router();
  private aerodromeService: AerodromeService;


  private getRewards: RequestHandler = async (req, res, next) => {
    try {
      const gaugeAddress = req.query.gauge as string;
      const userAddress = req.query.user as string;
      const tokenId = req.query.tokenId as string; // <-- NEW
  
      if (!gaugeAddress || !userAddress || !tokenId) {
        res.status(400).json({ error: "Missing 'gauge', 'user', or 'tokenId' query params." });
        return;
      }
  
      const rewards = await this.aerodromeService.getRewardsInfo(gaugeAddress, userAddress, tokenId);
  
      res.json(rewards);
    } catch (err) {
      next(err);
    }
  };

  private quoteAddLiquidity: RequestHandler = async (req, res, next) => {
    try {
      const { tokenA, tokenB, amountA, amountB } = req.query;
      if (!tokenA || !tokenB || !amountA || !amountB) {
        res.status(400).json({ error: "Missing 'tokenA', 'tokenB', 'amountA', 'amountB' query params." });
        return;
      }

      const quote = await this.aerodromeService.quoteAddLiquidity(
        tokenA as string,
        tokenB as string,
        amountA as string,
        amountB as string
      );

      // Sends the response
      res.json(quote);
    } catch (err) {
      next(err);
    }
  };
    // New endpoint arrow function
  private gaugeDetails: RequestHandler = async (req, res, next) => {
    try {
      const gaugeAddress = req.query.gauge as string;
      if (!gaugeAddress) {
        res.status(400).json({ error: "Missing 'gauge' query param." });
        return;
      }
      // Call getGaugeDetails
      const details = await this.aerodromeService.getGaugeDetails(gaugeAddress);
      res.json(details);
    } catch (err) {
      next(err);
    }
  };

  private quoteRemoveLiquidity: RequestHandler = async (req, res, next) => {
    try {
      const { tokenA, tokenB, liquidity } = req.query;
  
      if (!tokenA || !tokenB || !liquidity) {
        // Instead of `return res.status(400).json(...)`
        res.status(400).json({ 
          error: "Missing 'tokenA', 'tokenB', or 'liquidity' query params." 
        });
        return; // <--- return void, no Response
      }
  
      const result = await this.aerodromeService.quoteRemoveLiquidity(
        tokenA as string,
        tokenB as string,
        liquidity as string
      );
  
      // Simply call res.json(...) and then return
      res.json(result);
      return; // <--- again, return void
    } catch (err) {
      next(err);
    }
  };

  private addLiquidityMock: RequestHandler = async (req, res, next) => {
    try {
      const { tokenA, tokenB, amountA, amountB, user } = req.query;
  
      if (!tokenA || !tokenB || !amountA || !amountB || !user) {
        res.status(400).json({
          error: "Missing 'tokenA', 'tokenB', 'amountA', 'amountB' or 'user' query params."
        });
        return;
      }
  
      // Calls the mock function in the service
      const mockResult = await this.aerodromeService.addLiquidityMock(
        tokenA as string,
        tokenB as string,
        amountA as string,
        amountB as string,
        user as string
      );
  
      // Returns the simulated result
      res.json(mockResult);
    } catch (err) {
      next(err);
    }
  };
  

  constructor() {
    this.aerodromeService = new AerodromeService();
    this.initRoutes();
  }

  private initRoutes() {

    this.router.get("/rewards", this.getRewards);
    this.router.get("/quoteAddLiquidity", this.quoteAddLiquidity);
    this.router.get("/quoteRemoveLiquidity", this.quoteRemoveLiquidity);
    this.router.get("/gaugeDetails", this.gaugeDetails);
    this.router.get("/addLiquidityMock", this.addLiquidityMock);
  

  }

}
