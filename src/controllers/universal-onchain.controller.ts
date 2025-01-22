import { UniversalOnChainService } from "../services/universal-onchain.service";

export class OnChainController {
  public onChainService: UniversalOnChainService;

  constructor() {
    const rpcUrl = "https://mainnet.base.org" ;
    this.onChainService = new UniversalOnChainService(rpcUrl);
  }

  /**
   * Retrieves the owner of the contract.
   * @returns {Promise<string>} The address of the contract owner.
   */
  public async getOwner(): Promise<string> {
    return this.onChainService.getOwner();
  }


}
