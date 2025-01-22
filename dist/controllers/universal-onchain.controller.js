"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnChainController = void 0;
const universal_onchain_service_1 = require("../services/universal-onchain.service");
class OnChainController {
    constructor() {
        const rpcUrl = "https://mainnet.base.org";
        this.onChainService = new universal_onchain_service_1.UniversalOnChainService(rpcUrl);
    }
    /**
     * Retrieves the owner of the contract.
     * @returns {Promise<string>} The address of the contract owner.
     */
    async getOwner() {
        return this.onChainService.getOwner();
    }
}
exports.OnChainController = OnChainController;
