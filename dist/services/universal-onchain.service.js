"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniversalOnChainService = void 0;
const ethers_1 = require("ethers");
const typechain_1 = require("../typechain");
class UniversalOnChainService {
    constructor(rpcUrl) {
        this.provider = new ethers_1.ethers.JsonRpcProvider(rpcUrl);
        // createRandom() in ethers v6 returns HDNodeWallet
        const randomWallet = ethers_1.ethers.Wallet.createRandom();
        // Connect the wallet to the provider
        this.signer = randomWallet.connect(this.provider);
        const REACTOR_ADDRESS = "0xC5DC4B297F4e90A84d3b229523fd9d0247CF470f";
        this.reactorContract = typechain_1.ExclusiveDutchOrderReactor__factory.connect(REACTOR_ADDRESS, this.signer);
    }
    /**
     * Read-only method: calls "owner()" (view).
     * No gas cost.
     */
    async getOwner() {
        try {
            const ownerAddress = await this.reactorContract.owner();
            return ownerAddress;
        }
        catch (error) {
            console.error("Error retrieving the contract owner:", error);
            throw new Error("Failed to get owner.");
        }
    }
}
exports.UniversalOnChainService = UniversalOnChainService;
