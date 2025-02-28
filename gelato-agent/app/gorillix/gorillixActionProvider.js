"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gorillixActionProvider = exports.GorillixActionProvider = void 0;
const zod_1 = require("zod");
const actionProvider_1 = require("@coinbase/agentkit");
const actionDecorator_1 = require("@coinbase/agentkit");
const schemas_1 = require("./schemas");
const wallet_providers_1 = require("@coinbase/agentkit");
const faucet = require("./FaucetAbi");
const gorillix = require("./GorillixAbi");
const viem_1 = require("viem");
/**
 * GorillixActionProvider is an action provider for interacting with Gorillix DEX.
 */
class GorillixActionProvider extends actionProvider_1.ActionProvider {
    /**
     * Constructor for the GorillixActionProvider.
     */
    constructor() {
        super("gorillix", []);

        this.supportsNetwork = (_) => true;
    }
    async requestTokens(walletProvider, args) {
        try {
            const hash = await walletProvider.sendTransaction({
                to: faucet.FAUCET_ADDRESS,
                data: (0, viem_1.encodeFunctionData)({
                    abi: faucet.ABI,
                    functionName: "requestFaucet",
                }),
            })
            await walletProvider.waitForTransactionReceipt(hash);
            return `Successfully requested 10 TokenA and 10 TokenB.`;
        }
        catch (error) {
            return `Transaction failed: ${error}`;
        }
    }
}
exports.GorillixActionProvider = GorillixActionProvider;
__decorate([
    (0, actionDecorator_1.CreateAction)({
        name: "request_tokens",
        description: `
    This tool will request 10 TokenA and 10 TokenB from the Gorillix faucet.
    `,
        schema: schemas_1.RequestTokensSchema,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [wallet_providers_1.EvmWalletProvider, void 0]),
    __metadata("design:returntype", Promise)
], GorillixActionProvider.prototype, "requestTokens", null);
const gorillixActionProvider = () => new GorillixActionProvider();
exports.gorillixActionProvider = gorillixActionProvider;
