"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CexService = void 0;
const ccxt_1 = __importDefault(require("ccxt"));
class CexService {
    /**
     * Calls the ccxt API to get the ticker of a pair on an exchange.
     */
    async getTicker(exchangeName, symbol) {
        // Verify that ccxt has this exchange
        const exchangeClass = ccxt_1.default[exchangeName];
        if (!exchangeClass) {
            throw new Error(`Unknown exchange: ${exchangeName}`);
        }
        // Instantiate the exchange with rateLimit enabled
        const exchange = new exchangeClass({ enableRateLimit: true });
        // ccxt's fetchTicker returns an object with market info
        const ticker = await exchange.fetchTicker(symbol);
        return ticker;
    }
}
exports.CexService = CexService;
