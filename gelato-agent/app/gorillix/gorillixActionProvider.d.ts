import { z } from "zod";
import { ActionProvider, Network, EvmWalletProvider } from "@coinbase/agentkit";
import { GetLPTokensPerUserSchema, GetTotalLiquidityTokenAPerUserSchema, GetTotalLiquidityTokenASchema, RequestTokensSchema, SwapTokenAToTokenBSchema } from "./schemas";
/**
 * GorillixActionProvider is an action provider for interacting with Gorillix DEX.
 */
export declare class GorillixActionProvider extends ActionProvider<EvmWalletProvider> {
    /**
     * Constructor for the GorillixActionProvider.
     */
    constructor();
    requestTokens(walletProvider: EvmWalletProvider, args: z.infer<typeof RequestTokensSchema>): Promise<string>;
    swapTokenAToTokenB(walletProvider: EvmWalletProvider, args: z.infer<typeof SwapTokenAToTokenBSchema>): Promise<string>;
    getTotalLiquidityTokenA(walletProvider: EvmWalletProvider, args: z.infer<typeof GetTotalLiquidityTokenASchema>): Promise<string>;
    getTotalLiquidityTokenB(walletProvider: EvmWalletProvider, args: z.infer<typeof GetTotalLiquidityTokenBSchema>): Promise<string>;
    getTotalLiquidityTokenAPerUser(walletProvider: EvmWalletProvider, args: z.infer<typeof GetTotalLiquidityTokenAPerUserSchema>): Promise<string>;
    getTotalLiquidityTokenBPerUser(walletProvider: EvmWalletProvider, args: z.infer<typeof GetTotalLiquidityTokenBPerUserSchema>): Promise<string>;
    getLPTokensPerUser(walletProvider: EvmWalletProvider, args: z.infer<typeof GetLPTokensPerUserSchema>): Promise<string>;

    supportsNetwork: (_: Network) => boolean;
}
/**
 * Specs
 */
export declare const gorillixActionProvider: () => GorillixActionProvider;