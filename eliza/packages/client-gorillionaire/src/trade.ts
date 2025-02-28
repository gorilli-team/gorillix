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

                    // console.log(
                    //     "\x1b[34m%s\x1b[0m",
                    //     "ALL PLUGINS:",
                    //     this.runtime.plugins.map((p) => p.name)
                    // );

                    const agentkit = await this.runtime.plugins.find(
                        (plugin) => plugin.name === "[AgentKit] Integration"
                    );

                    if (!agentkit) {
                        throw new Error("Agentkit plugin not found");
                    }

                    const getAllActions = agentkit.actions;

                    console.log(
                        "\x1b[36m%s\x1b[0m",
                        "ELIZA => Actions:",
                        getAllActions.map((action) => action.name)
                    );

                    // Wait for 1 hour before next execution
                    await new Promise((resolve) =>
                        setTimeout(resolve, 10 * 1000)
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
