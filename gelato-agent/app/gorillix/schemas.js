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