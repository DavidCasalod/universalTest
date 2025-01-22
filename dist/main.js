"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const aerodrome_controller_1 = require("./controllers/aerodrome.controller");
const universal_onchain_controller_1 = require("./controllers/universal-onchain.controller");
const cex_controller_1 = require("./controllers/cex.controller");
async function bootstrap() {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    const onChainController = new universal_onchain_controller_1.OnChainController();
    // Define a regular handler without returning the Response
    app.get("/owner", async (req, res, next) => {
        try {
            const ownerAddress = await onChainController.getOwner();
            // Call res.json(...) and DO NOT return its value
            res.json({ owner: ownerAddress });
        }
        catch (err) {
            next(err);
        }
    });
    const liquidityController = new aerodrome_controller_1.LiquidityController();
    app.use("/liquidity", liquidityController.router);
    // Instantiate the CEX controller
    const cexController = new cex_controller_1.CexController();
    // Mount its routes on /cex
    app.use("/cex", cexController.router);
    // (Optional) error handling middleware
    app.use((err, req, res, next) => {
        console.error("Unhandled error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    });
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
}
bootstrap().catch(err => {
    console.error("Error starting app:", err);
    process.exit(1);
});
