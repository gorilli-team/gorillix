import { z } from "zod";
import { ActionProvider, Network, EvmWalletProvider } from "@coinbase/agentkit";
import { RequestTokensSchema } from "./schemas";
/**
 * GorillixActionProvider is an action provider for interacting with Gorillix DEX.
 */
export declare class GorillixActionProvider extends ActionProvider<EvmWalletProvider> {
    /**
     * Constructor for the GorillixActionProvider.
     */
    constructor();
    requestTokens(walletProvider: EvmWalletProvider, args: z.infer<typeof RequestTokensSchema>): Promise<string>;

    supportsNetwork: (_: Network) => boolean;
}
/**
 * Specs
 */
export declare const gorillixActionProvider: () => GorillixActionProvider;