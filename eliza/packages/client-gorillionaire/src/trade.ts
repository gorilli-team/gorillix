import {
    type IAgentRuntime,
    type Memory,
    type Content,
    type State,
} from "@elizaos/core";
import type { ClientBase } from "./base.ts";
// import { coinmarketcapPlugin } from "@elizaos/plugin-coinmarketcap";
// import { agentkitPlugin } from "@elizaos/plugin-agentkit";
import { getEmbeddingZeroVector } from "@elizaos/core";
import { stringToUuid } from "@elizaos/core";

export class GorillionaireTradeClient {
    client: ClientBase;
    runtime: IAgentRuntime;

    private stopProcessingActions = false;

    constructor(client: ClientBase, runtime: IAgentRuntime) {
        this.client = client;
        this.runtime = runtime;

        console.log("TRADE Client Configuration:");
    }

    async start() {
        const processActionsLoop = async () => {
            while (!this.stopProcessingActions) {
                try {
                    console.log(
                        "\x1b[36m%s\x1b[0m",
                        "ELIZA => Executing agent strategy"
                    );

                    //fetch from api
                    const response = await fetch(
                        "http://localhost:5001/api/agent/configs"
                    );

                    const responseData = await response.json();

                    console.log("\x1b[38;5;214m", responseData.data, "\x1b[0m");

                    await new Promise((resolve) =>
                        setTimeout(resolve, 60 * 1000)
                    );
                } catch (error) {
                    console.error("Error in action processing loop:", error);
                    await new Promise((resolve) => setTimeout(resolve, 30000));
                }
            }
        };

        processActionsLoop().catch((error) => {
            console.error("Fatal error in process actions loop:", error);
        });
    }

    async stop() {
        this.stopProcessingActions = true;
    }
}
