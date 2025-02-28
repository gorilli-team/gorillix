import { type Client, elizaLogger, type IAgentRuntime } from "@elizaos/core";
import { ClientBase } from "./base.ts";
import { GorillionaireTradeClient } from "./trade.ts";

/**
 * A manager that orchestrates all specialized Twitter logic:
 * - client: base operations (login, timeline caching, etc.)
 * - post: autonomous posting logic
 * - search: searching tweets / replying logic
 * - interaction: handling mentions, replies
 * - space: launching and managing Twitter Spaces (optional)
 */
class GorillionaireManager {
    client: ClientBase;
    trade: GorillionaireTradeClient;

    constructor(runtime: IAgentRuntime) {
        console.log("--- RUNNING GorillionaireManager");

        // Pass twitterConfig to the base client
        this.client = new ClientBase(runtime);

        //Trading activities
        this.trade = new GorillionaireTradeClient(this.client, runtime);

        console.log("--- YO");
    }
}

export const GorillionaireClientInterface: Client = {
    async start(runtime: IAgentRuntime) {
        console.log("GORILLI -> STARTING CLIENT INTERFACE");

        const manager = new GorillionaireManager(runtime);
        console.log("GORILLI -> AFTER MANAGER");

        // Start trading checks
        await manager.trade.start();
        console.log("GORILLI -> AFTER TRADE START");

        return manager;
    },

    async stop(_runtime: IAgentRuntime) {
        elizaLogger.warn("Gorillionaire client does not support stopping yet");
    },
};

export default GorillionaireClientInterface;
