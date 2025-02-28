"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestTokensSchema = exports.RequestTokensSchema = void 0;
const zod_1 = require("zod");
/**
 * Input schema for request tokens action.
 */
exports.RequestTokensSchema = zod_1.z
    .object({
})
    .strip()
    .describe("Instructions for requesting tokens from faucet");
/**
 * Input schema for getting total liquidity TokenA
 */
exports.GetTotalLiquidityTokenASchema = zod_1.z
    .object({
})
    .strip()
    .describe("Instructions for getting total liquidity TokenA");
/**
 * Input schema for getting total liquidity TokenB
 */
exports.GetTotalLiquidityTokenBSchema = zod_1.z
    .object({
})
    .strip()
    .describe("Instructions for getting total liquidity TokenB");
/**
 * Input schema for getting total liquidity TokenA per user
 */
exports.GetTotalLiquidityTokenAPerUserSchema = zod_1.z
    .object({
    contractAddress: zod_1.z
        .string()
        .describe("The wallet address of the user to get the total liquidity of TokenA provided in Gorillix DEX"),
})
    .strip()
    .describe("Instructions for getting the liquidity of TokenA provided by a certain user in Gorillix DEX");
/**
 * Input schema for getting total liquidity TokenA per user
 */
exports.GetTotalLiquidityTokenAPerUserSchema = zod_1.z
    .object({
    contractAddress: zod_1.z
        .string()
        .describe("The wallet address of the user to get the total liquidity of TokenA provided in Gorillix DEX"),
    })
    .strip()
    .describe("Instructions for getting the liquidity of TokenA provided by a certain user in Gorillix DEX");
/**
 * Input schema for getting total liquidity TokenB per user
 */
exports.GetTotalLiquidityTokenBPerUserSchema = zod_1.z
    .object({
    contractAddress: zod_1.z
        .string()
        .describe("The wallet address of the user to get the total liquidity of TokenB provided in Gorillix DEX"),
})
    .strip()
    .describe("Instructions for getting the liquidity of TokenB provided by a certain user in Gorillix DEX");
/**
 * Input schema for getting the amount of LP Tokens per user
 */
exports.GetLPTokensPerUserSchema = zod_1.z
    .object({
    contractAddress: zod_1.z
        .string()
        .describe("The wallet address of the user to get the amount of LP Tokens in Gorillix DEX"),
    })
    .strip()
    .describe("Instructions for getting the amount of LP Tokens for a certain user in Gorillix DEX");
/**
 * Input schema for swap tokenA to tokenB action.
 */
exports.SwapTokenAToTokenB = zod_1.z
    .object({
    amount: zod_1.z.custom().describe("The amount of the TokenA to swap for TokenB"),
})
        .strip()
        .describe("Instructions for swapping TokenA for TokenB");
        