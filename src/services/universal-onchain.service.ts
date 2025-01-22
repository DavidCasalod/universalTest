import { ethers, JsonRpcProvider, type Signer } from "ethers";
import {
  ExclusiveDutchOrderReactor__factory,
  ExclusiveDutchOrderReactor
} from "../typechain";

export class UniversalOnChainService {
  private provider: JsonRpcProvider;
  private signer: Signer; // <-- Signer type, more general
  private reactorContract: ExclusiveDutchOrderReactor;

  constructor(rpcUrl: string) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);

    const randomWallet = ethers.Wallet.createRandom();

    // Connect the wallet to the provider
    this.signer = randomWallet.connect(this.provider);

    const REACTOR_ADDRESS = "0xC5DC4B297F4e90A84d3b229523fd9d0247CF470f";
    this.reactorContract = ExclusiveDutchOrderReactor__factory.connect(
      REACTOR_ADDRESS,
      this.signer
    );
  }

  /**
   * Read-only method: calls "owner()" (view).
   * No gas cost.
   */
  public async getOwner(): Promise<string> {
    try {
      const ownerAddress = await this.reactorContract.owner();
      return ownerAddress;
    } catch (error: any) {
      console.error("Error retrieving the contract owner:", error);
      throw new Error("Failed to get owner.");
    }
  }
}
