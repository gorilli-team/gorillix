"use strict";
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
          ? (desc = Object.getOwnPropertyDescriptor(target, key))
          : desc,
      d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
var __metadata =
  (this && this.__metadata) ||
  function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
      return Reflect.metadata(k, v);
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
      });
      await walletProvider.waitForTransactionReceipt(hash);
      return `Successfully requested 10 TokenA and 10 TokenB.`;
    } catch (error) {
      return `Transaction failed: ${error}`;
    }
  }

  async getTotalLiquidityTokenA(walletProvider, args) {
    try {
      const totalLiquidityTokenA = await walletProvider.readContract({
        address: gorillix.GORILLIX_ADDRESS,
        abi: gorillix.ABI,
        functionName: "getTotalLiquidityTokenA",
      });
      return `Total liquidity TokenA is ${totalLiquidityTokenA}.`;
    } catch (error) {
      return `Error getting total liquidity TokenA: ${error}`;
    }
  }

  async getTotalLiquidityTokenB(walletProvider, args) {
    try {
      const totalLiquidityTokenB = await walletProvider.readContract({
        address: gorillix.GORILLIX_ADDRESS,
        abi: gorillix.ABI,
        functionName: "getTotalLiquidityTokenB",
      });
      return `Total liquidity TokenB is ${totalLiquidityTokenB}.`;
    } catch (error) {
      return `Error getting total liquidity TokenB: ${error}`;
    }
  }

  async getLiquidityTokenAPerUser(walletProvider, args) {
    try {
      const liquidityTokenAPerUser = await walletProvider.readContract({
        address: gorillix.GORILLIX_ADDRESS,
        abi: gorillix.ABI,
        functionName: "getLiquidityTokenAPerUser",
        args: [args.contractAddress],
      });
      return `The liquidity for TokenA provided by ${args.contractAddress} is ${liquidityTokenAPerUser}.`;
    } catch (error) {
      return `Error getting total liquidity TokenA per user: ${error}`;
    }
  }

  async getLiquidityTokenBPerUser(walletProvider, args) {
    try {
      const liquidityTokenBPerUser = await walletProvider.readContract({
        address: gorillix.GORILLIX_ADDRESS,
        abi: gorillix.ABI,
        functionName: "getLiquidityTokenBPerUser",
        args: [args.contractAddress],
      });
      return `The liquidity for TokenB provided by ${args.contractAddress} is ${liquidityTokenBPerUser}.`;
    } catch (error) {
      return `Error getting total liquidity TokenB per user: ${error}`;
    }
  }

  async getLPTokensPerUser(walletProvider, args) {
    try {
      const liquidityTokenBPerUser = await walletProvider.readContract({
        address: gorillix.GORILLIX_ADDRESS,
        abi: gorillix.ABI,
        functionName: "balanceOf",
        args: ["0x3f467DAee595C5726b33A4b6CbD75F420EcC57e9"],
      });
      return `The LP Tokens of ${args.contractAddress} are ${liquidityTokenBPerUser}.`;
    } catch (error) {
      return `Error getting LP Tokens for user ${args.contractAddress}: ${error}`;
    }
  }

  async swapTokenAToTokenB(walletProvider, args) {
    try {
      const hash = await walletProvider.sendTransaction({
        to: gorillix.GORILLIX_ADDRESS,
        data: (0, viem_1.encodeFunctionData)({
          abi: gorillix.ABI,
          functionName: "tokenAtoTokenB",
          args: [BigInt(1000000000000000000)],
        }),
      });
      await walletProvider.waitForTransactionReceipt(hash);
      return `Successfully swapped ${args.amountTokenA} TokenA.`;
    } catch (error) {
      return `Transaction failed: ${error}`;
    }
  }
}
exports.GorillixActionProvider = GorillixActionProvider;
__decorate(
  [
    (0, actionDecorator_1.CreateAction)({
      name: "request_tokens",
      description: `
    This tool will request 10 TokenA and 10 TokenB from the Gorillix faucet.
    `,
      schema: schemas_1.RequestTokensSchema,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [
      wallet_providers_1.EvmWalletProvider,
      void 0,
    ]),
    __metadata("design:returntype", Promise),
  ],
  GorillixActionProvider.prototype,
  "requestTokens",
  null
);
__decorate(
  [
    (0, actionDecorator_1.CreateAction)({
      name: "swap_tokenA_to_tokenB",
      description: `
    This tool will swap an arbitrary amount of TokenA to TokenB on Gorillix DEX.
    `,
      schema: schemas_1.SwapTokenAToTokenBSchema,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [
      wallet_providers_1.EvmWalletProvider,
      void 0,
    ]),
    __metadata("design:returntype", Promise),
  ],
  GorillixActionProvider.prototype,
  "swapTokenAToTokenB",
  null
);
__decorate(
  [
    (0, actionDecorator_1.CreateAction)({
      name: "get_total_liquidity_tokenA",
      description: `
    This tool will check the total liquidity for TokenA in Gorillix DEX.
    `,
      schema: schemas_1.GetTotalLiquidityTokenASchema,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [
      wallet_providers_1.EvmWalletProvider,
      void 0,
    ]),
    __metadata("design:returntype", Promise),
  ],
  GorillixActionProvider.prototype,
  "getTotalLiquidityTokenA",
  null
);
__decorate(
  [
    (0, actionDecorator_1.CreateAction)({
      name: "get_total_liquidity_tokenB",
      description: `
    This tool will check the total liquidity for TokenB in Gorillix DEX.
    `,
      schema: schemas_1.GetTotalLiquidityTokenBSchema,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [
      wallet_providers_1.EvmWalletProvider,
      void 0,
    ]),
    __metadata("design:returntype", Promise),
  ],
  GorillixActionProvider.prototype,
  "getTotalLiquidityTokenB",
  null
);
__decorate(
  [
    (0, actionDecorator_1.CreateAction)({
      name: "get_total_liquidity_tokenA_per_user",
      description: `
    This tool will check the total liquidity for TokenA provided by a certain user in Gorillix DEX.
    `,
      schema: schemas_1.GetTotalLiquidityTokenAPerUserSchema,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [
      wallet_providers_1.EvmWalletProvider,
      void 0,
    ]),
    __metadata("design:returntype", Promise),
  ],
  GorillixActionProvider.prototype,
  "getLiquidityTokenAPerUser",
  null
);
__decorate(
  [
    (0, actionDecorator_1.CreateAction)({
      name: "get_total_liquidity_tokenB_per_user",
      description: `
    This tool will check the total liquidity for TokenB provided by a certain user in Gorillix DEX.
    `,
      schema: schemas_1.GetTotalLiquidityTokenBPerUserSchema,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [
      wallet_providers_1.EvmWalletProvider,
      void 0,
    ]),
    __metadata("design:returntype", Promise),
  ],
  GorillixActionProvider.prototype,
  "getLiquidityTokenBPerUser",
  null
);
__decorate(
  [
    (0, actionDecorator_1.CreateAction)({
      name: "get_lp_tokens_per_user",
      description: `
    This tool will check the amount of LP Tokens for a given user.
    `,
      schema: schemas_1.RequestTokensSchema,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [
      wallet_providers_1.EvmWalletProvider,
      void 0,
    ]),
    __metadata("design:returntype", Promise),
  ],
  GorillixActionProvider.prototype,
  "getLPTokensPerUser",
  null
);
const gorillixActionProvider = () => new GorillixActionProvider();
exports.gorillixActionProvider = gorillixActionProvider;
