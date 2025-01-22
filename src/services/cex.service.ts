import ccxt from "ccxt";

export class CexService {
  /**
   * Calls the ccxt API to get the ticker of a pair on an exchange.
   */
  public async getTicker(exchangeName: string, symbol: string) {
    // Verify that ccxt has this exchange
    const exchangeClass = (ccxt as any)[exchangeName];
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
