import { ethers } from "ethers";
import aerodromeRouterAbi from "../abis/aerodromeRouter.json";
import gaugeAbi from "../abis/gauge.json";

export class AerodromeService {
  private provider: ethers.JsonRpcProvider;
  private routerContract: ethers.Contract;

  // Address of the factory
  private readonly FACTORY_ADDRESS = "0x420DD381b31aEf6683db6B902084cB0FFECe40Da";
  // Address of the Aerodrome router on Base
  private readonly ROUTER_ADDRESS = "0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43";

  constructor() {
    // 1. Connect to the Base network. Adjust the URL for testnet or mainnet
    this.provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
    
    // 2. Instance of the Aerodrome Router (read-only)
    this.routerContract = new ethers.Contract(
      this.ROUTER_ADDRESS,
      aerodromeRouterAbi,
      this.provider
    );
  }

  /**
   * Calls all gauge functions that require no parameters
   * and returns their values in a JSON object.
   */
  public async getGaugeDetails(gaugeAddress: string) {
    const gaugeContract = new ethers.Contract(gaugeAddress, gaugeAbi, this.provider);
  
    // Sequential calls instead of Promise.all
    const WETH9 = await gaugeContract.WETH9();
    const fees0 = await gaugeContract.fees0();
    const fees1 = await gaugeContract.fees1();
    const feesVotingReward = await gaugeContract.feesVotingReward();
    const gaugeFactory = await gaugeContract.gaugeFactory();
    const isPool = await gaugeContract.isPool();
    const left = await gaugeContract.left();
    const nft = await gaugeContract.nft();
    const periodFinish = await gaugeContract.periodFinish();
    const pool = await gaugeContract.pool();
  
    const rewardRate = await gaugeContract.rewardRate();
    const rewardToken = await gaugeContract.rewardToken();
    const supportsPayable = await gaugeContract.supportsPayable();
    const tickSpacing = await gaugeContract.tickSpacing();
    const token0 = await gaugeContract.token0();
    const token1 = await gaugeContract.token1();
    const voter = await gaugeContract.voter();
  
    // Convert to string where uint/int
    return {
      WETH9,
      fees0: fees0.toString(),
      fees1: fees1.toString(),
      feesVotingReward,
      gaugeFactory,
      isPool,
      left: left.toString(),
      nft,
      periodFinish: periodFinish.toString(),
      pool,
  
      rewardRate: rewardRate.toString(),
      rewardToken,
      supportsPayable,
      tickSpacing: Number(tickSpacing),
      token0,
      token1,
      voter
    };
  }

  /**
   * Calls a gauge to check pending rewards for a user.
   */
  public async getRewardsInfo(
    gaugeAddress: string, 
    userAddress: string, 
    tokenId: string
  ) {
    const gaugeContract = new ethers.Contract(gaugeAddress, gaugeAbi, this.provider);
  
    // Convert tokenId string => BigInt
    const parsedTokenId = BigInt(tokenId);
  
    // Call the earned(address, uint256) function
    const earnedBN = await gaugeContract.earned(userAddress, parsedTokenId);
  
    // Convert to string format
    const rewards = ethers.formatUnits(earnedBN, 18);
  
    return {
      gaugeAddress,
      userAddress,
      tokenId,
      rewards
    };
  }

  /**
   * Calls quoteAddLiquidity(...) on the router (read-only)
   * to simulate how many tokens are actually needed
   * and how many LP tokens would be minted.
   */
  public async quoteAddLiquidity(tokenA: string, tokenB: string, amountA: string, amountB: string) {
    const stable = false; // Depends on the pool
    const parsedA = ethers.parseUnits(amountA, 18);
    const parsedB = ethers.parseUnits(amountB, 18);

    const [resA, resB, liq] = await this.routerContract.quoteAddLiquidity(
      tokenA,
      tokenB,
      stable,
      this.FACTORY_ADDRESS,
      parsedA,
      parsedB
    );

    const neededA = ethers.formatUnits(resA, 18);
    const neededB = ethers.formatUnits(resB, 18);
    const liquidity = ethers.formatUnits(liq, 18);

    return {
      neededA,
      neededB,
      liquidity
    };
  }

  /**
   * Calls quoteRemoveLiquidity(...) on the router (read-only)
   * to simulate how many tokens would be retrieved by burning 'liquidity' LP tokens.
   */
  public async quoteRemoveLiquidity(
    tokenA: string,
    tokenB: string,
    liquidity: string
  ) {
    const stable = false; // Adjust if your pool is stable or not
    // Parse the amount of LP you "want" to remove
    const parsedLiquidity = ethers.parseUnits(liquidity, 18);
  
    // Read-only call
    const [amountA, amountB] = await this.routerContract.quoteRemoveLiquidity(
      tokenA,
      tokenB,
      stable,
      "0x5e7BB104d84c7CB9B682AaC2F3d509f5F406809A",
      parsedLiquidity
    );
  
    // Convert BigInt to string in human-readable format
    const resultA = ethers.formatUnits(amountA, 18);
    const resultB = ethers.formatUnits(amountB, 18);
  
    return {
      amountA: resultA,
      amountB: resultB,
    };
  }

  /**
   * MOCK: Simulates "addLiquidity(...)" without sending a real TX.
   * Returns an object with fake data (e.g., txHash, amounts).
   */
  public async addLiquidityMock(
    tokenA: string,
    tokenB: string,
    amountA: string,
    amountB: string,
    user: string
  ) {
    // You could parse amountA and amountB with ethers.parseUnits to simulate scaling,
    // but in a mock, it's not mandatory.

    // Return a fake response
    return {
      success: true,
      user,
      tokenA,
      tokenB,
      amountA,
      amountB,
      // A fake txHash to make it look real
      txHash: "0xMOCKTRANSACTIONHASH1234567890",
      // Message
      message: `Mock addLiquidity: user ${user} provided ${amountA} of ${tokenA} and ${amountB} of ${tokenB}. No real TX sent.`
    };
  }
}
