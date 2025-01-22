# Universal Exchange Backend (Test)

This project is a **TypeScript** backend that demonstrates **CEX-like** and **DEX-like** functionality, integrating **Universal Protocol** logic (on-chain calls to an **ExclusiveDutchOrderReactor**), **Aerodrome** (a DeFi protocol on Base), and **CCXT** (for centralized exchange data). It is designed to showcase how an exchange backend might unify multiple services: DeFi liquidity, a mock CEX, and on-chain interactions with Universal.


## Table of Contents

1. [Motivation](#motivation)
2. [Architecture](#architecture)
3. [Setup](#setup)
4. [Endpoints](#endpoints)
   - [Universal On-Chain (owner, gauge, etc.)](#universal-on-chain-endpoints)
   - [Aerodrome (Liquidity, Gauges)](#aerodrome-endpoints)
   - [CEX (Binance Ticker via CCXT)](#cex-endpoints)
5. [Mock Functionality](#mock-functionality)
6. [Possible Extensions](#possible-extensions)
7. [License](#license)

---

## Motivation

**Context**:  
- Universal is on a mission to “close the gap” between CEX and DEX. They want to unify liquidity across multiple chains, bridging assets like BTC, SOL, etc.  
- This backend demonstrates a partial implementation for a new exchange that can settle **uAssets** on-chain, interact with a DeFi protocol (Aerodrome) for liquidity, and retrieve CEX data (via CCXT).

**Key Goals**:
1. **Show On-Chain Integration**: We can call functions of a Universal contract (e.g. an `ExclusiveDutchOrderReactor`) or read from DeFi gauges.  
2. **Demonstrate DEX Liquidity**: We connect to Aerodrome on Base (for quoting add/remove liquidity, gauge data, etc.).  
3. **Provide a CEX flavor**: We use CCXT to fetch real ticker data from centralized exchanges.  
4. **Mock** some actions that would ordinarily cost gas, such as adding liquidity, to avoid real funds or private key usage.

---

## Architecture
I chose to implement this as a monolithic backend for simplicity and ease of local deployment. All controllers (Universal on-chain, Aerodrome, CEX) are contained in one Express application, so you can run everything via a single process.

```
universal-test-exchange/
├── src/
│   ├── abis/
│   │   ├── ExclusiveDutchOrderReactor.json
│   │   ├── aerodromeRouter.json
│   │   └── gauge.json
│   ├── controllers/
│   │   ├── aerodrome.controller.ts  // Aerodrome endpoints
│   │   ├── cex.controller.ts        // CCXT-based endpoints
│   │   └── universal-onchain.controller.ts // Interactions with Universal contracts
│   ├── services/
│   │   ├── aerodrome.service.ts     // Logic for Aerodrome DeFi
│   │   ├── cex.service.ts           // CCXT integration
│   │   └── universal-onchain.service.ts // Calls to ExclusiveDutchOrderReactor
│   ├── typechain/
│   │   └── ... (generated TypeChain files for ExclusiveDutchOrderReactor)
│   ├── main.ts                      // Entry point (Express server)
├── package.json
├── tsconfig.json
└── README.md (this file)
```
However, for production-grade scalability and independent deployments, it’s generally better to split these features into microservices. Each microservice handles a specific domain—CEX aggregator, on-chain settlement, DeFi liquidity—and communicates through lightweight APIs or a message bus.

Below is a rough microservices architecture diagram:

     [ CEX Service ]      [ On-Chain Settlement Service ]      [ DeFi / Aerodrome Service ]
            |                         |                                     |
            |----- (REST APIs or message bus)  ----------------------------|
            |
            |------------ [ API Gateway / Load Balancer ]  -----------------|
                                     |
                                     |
                            [ Frontend or Clients ]


Each microservice can be deployed and scaled independently, updated without affecting the others, and can use separate resource limits. This approach also isolates issues.
### Main Modules

- **`src/main.ts`**: Bootstraps an Express server, registers controllers.  
- **`controllers/`**: Each controller handles a domain (CEX data, Aerodrome liquidity, Universal on-chain).  
- **`services/`**: Business logic or integrations. For example:

  - `aerodrome.service.ts` calls read-only or mock methods for DeFi on Base.
  - `cex.service.ts` uses [CCXT](https://github.com/ccxt/ccxt) to fetch real data from Binance, Coinbase, etc.
  - `universal-onchain.service.ts` can call on-chain functions from an ExclusiveDutchOrderReactor to demonstrate bridging or custom DeFi logic.

- **`typechain/`**: TypeScript definitions generated for the `ExclusiveDutchOrderReactor` contract.

---

## Setup

1. **Clone** the repo  
   ```bash
   git clone https://github.com/DavidCasalod/universalTest.git
   cd universal-exchange-test
   ```

2. **Install Dependencies**  
   ```bash
   npm install
   ```

3. **Build**  
   ```bash
   npm run build
   ```
   (Compiles TypeScript into `dist/`.)

4. **Run**  
   ```bash
   npm start
   ```
   This will start the Express server (default port 3000).

---

## Endpoints

Below are the endpoints exposed. Some are purely read-only, some are mocks, some use CCXT, etc.

### Universal On-Chain Endpoints

- **GET /owner**

   Example:
   ```bash
   curl "http://localhost:3000/owner"
   ```
   - Returns the `owner()` from an on-chain Universal contract (e.g. ExclusiveDutchOrderReactor).
   - It reads an actual chain call but only calls a view function.


### Aerodrome Endpoints
- **GET /liquidity/gaugeDetails?gauge=0x...**

   Example:
   ```bash
   curl "http://localhost:3000/liquidity/gaugeDetails?gauge=0xeD5355807FB4e7A04A7Ff8Bbc20cf65d425cB868"
   ```
   - Returns on-chain read data (WETH9, fees, reward rate, etc.) from a gauge on Base.
   - WETH/uSUI
   On success:
   ```json
    {
        "WETH9": "0x4200000000000000000000000000000000000006",
        "fees0": "0",
        "fees1": "0",
        "feesVotingReward": "0x8aBcF36C13905064A92059Ba735FBA3A0EafC75a",
        "gaugeFactory": "0xD30677bd8dd15132F251Cb54CbDA552d2A05Fb08",
        "isPool": true,
        "left": "2339310006401458307418",
        "nft": "0x827922686190790b37229fd06084350E74485b72",
        "periodFinish": "1737590400",
        "pool": "0x5C45b0F48c326f79b56709d8F63CE2beE7697106",
        "rewardRate": "82640689808226174",
        "rewardToken": "0x940181a94A35A4569E4529A3CDfB74e38FD98631",
        "supportsPayable": true,
        "tickSpacing": 200,
        "token0": "0x4200000000000000000000000000000000000006",
        "token1": "0xb0505e5a99abd03d94a1169e638B78EDfEd26ea4",
        "voter": "0x16613524e02ad97eDfeF371bC883F2F5d6C480A5"
    }
   ```
- **GET /liquidity/rewards?gauge=0x...&user=0x...&tokenId=123**

   - Calls `earned(user, tokenId)` on a gauge.
   - If `earned` requires two params (address, uint256), we handle both.
   - Error if gauge is missing or if `tokenId` is invalid.

- ** uSUI/WETH:  GET /liquidity/quoteAddLiquidity?tokenA=...&tokenB=...&amountA=...&amountB=...**

   Example:
   ```bash
   curl "http://localhost:3000/liquidity/quoteAddLiquidity?tokenA=0xb0505e5a99abd03d94a1169e638b78edfed26ea4&tokenB=0x4200000000000000000000000000000000000006&amountA=300&amountB=800"
   ```
   - Reads `quoteAddLiquidity(...)` from the router (read-only).
   - Returns how many tokens uSUI and WETH are “needed” and how many LP tokens would be minted.

   On success:
   ```json
   {
     "neededA": "300.0",
     "neededB": "800.0",
     "liquidity": "489.897948556635618639"
   }
   ```

- **GET /liquidity/quoteRemoveLiquidity?tokenA=...&tokenB=...&liquidity=...**

   - Calls `quoteRemoveLiquidity(...)` on the router.
   - Tells how many tokens you’d get back if you “burn” that liquidity (LP tokens).
   - Also read-only, so no gas.

- **GET /liquidity/addLiquidityMock?tokenA=...&tokenB=...&amountA=...&amountB=...&user=0x...**

   Mock: returns a fake TX hash and “message,” with no real on-chain call.

   Example:
   ```bash
   curl -X GET "http://localhost:3000/liquidity/addLiquidityMock?tokenA=0xTokenA&tokenB=0xTokenB&amountA=100&amountB=50&user=0xUserAddress"
   ```
   Response (fake):
   ```json
   {
     "success": true,
     "user": "0xUserAddress",
     "tokenA": "0xTokenA",
     "tokenB": "0xTokenB",
     "amountA": "100",
     "amountB": "50",
     "txHash": "0xMOCKTRANSACTIONHASH1234567890",
     "message": "Mock addLiquidity..."
   }
   ```

### CEX Endpoints

Using CCXT to fetch real-time data from centralized exchanges:

- **GET /cex/ticker?exchange=binance&symbol=BTC/USDT**

   Example:
   ```bash
   curl "http://localhost:3000/cex/ticker?exchange=binance&symbol=BTC/USDT"
   ```
   - Returns a ticker object with `last`, `high`, `low`, `bid`, etc. from Binance.
   - You can change `exchange` to `coinbase`, etc. if supported by CCXT.
   - Requires no credentials for public ticker data.

   Response:
   ```json
    {
        "symbol": "BTC/USDT",
        "timestamp": 1737563166237,
        "datetime": "2025-01-22T16:26:06.237Z",
        "high": 107240.81,
        "low": 103662.58,
        "bid": 103955.56,
        "bidVolume": 0.08863,
        "ask": 103955.57,
        "askVolume": 3.79179,
        "vwap": 105531.76104939,
        "open": 106074,
        "close": 103955.56,
        "last": 103955.56,
        "previousClose": 106074,
        "change": -2118.44,
        "percentage": -1.997,
        "average": 105014.78,
        "baseVolume": 26939.1101,
        "quoteVolume": 2842931729.9564004,
        "info": {
            "symbol": "BTCUSDT",
            "priceChange": "-2118.44000000",
            "priceChangePercent": "-1.997",
            "weightedAvgPrice": "105531.76104939",
            "prevClosePrice": "106074.00000000",
            "lastPrice": "103955.56000000",
            "lastQty": "0.00011000",
            "bidPrice": "103955.56000000",
            "bidQty": "0.08863000",
            "askPrice": "103955.57000000",
            "askQty": "3.79179000",
            "openPrice": "106074.00000000",
            "highPrice": "107240.81000000",
            "lowPrice": "103662.58000000",
            "volume": "26939.11010000",
            "quoteVolume": "2842931729.95640030",
            "openTime": "1737476766237",
            "closeTime": "1737563166237",
            "firstId": "4446021673",
            "lastId": "4450668944",
            "count": "4647272"
        }
    }
   ```

---


 Most calls are read-only or `quote...` calls that do not require a private key or spending gas. This approach demonstrates the logic flow without real chain interactions.

---

- **Author:**
David Casalod
