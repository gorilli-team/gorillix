import { type IAgentRuntime } from "@elizaos/core";
import type { ClientBase } from "./base.ts";

export class GorillionaireTradeClient {
    client: ClientBase;
    runtime: IAgentRuntime;
    private stopProcessingActions = false;
    private agentKitApiEndpoint: string;
    private backendApiEndpoint: string;

    constructor(client: ClientBase, runtime: IAgentRuntime) {
        this.client = client;
        this.runtime = runtime;
        this.agentKitApiEndpoint = process.env.AGENT_API_ENDPOINT;
        this.backendApiEndpoint = process.env.BACKEND_API_ENDPOINT;

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
                        `${this.backendApiEndpoint}/api/agent/configs`
                    );

                    const responseData = await response.json();

                    if (responseData.data.length > 0) {
                        console.log(
                            "\x1b[38;5;214m",
                            responseData.data,
                            "\x1b[0m"
                        );

                        let tokenAPercentage = 0;

                        if (responseData.data.tradingStrategy === "swap") {
                            if (
                                responseData.data.riskLevel ===
                                "very-conservative"
                            ) {
                            }

                            if (
                                responseData.data.riskLevel === "conservative"
                            ) {
                                tokenAPercentage = 10;
                            }

                            if (responseData.data.riskLevel === "moderate") {
                                tokenAPercentage = 20;
                            }

                            if (responseData.data.riskLevel === "aggressive") {
                                tokenAPercentage = 30;
                            }

                            if (
                                responseData.data.riskLevel ===
                                "very-aggressive"
                            ) {
                                tokenAPercentage = 40;
                            }
                        }

                        //make a call to the agent to know token A and token B balances
                        const agentKitCall3 = await fetch(
                            this.agentKitApiEndpoint,
                            {
                                method: "POST",
                                body: JSON.stringify({
                                    userMessage:
                                        "what's your balance of token A?",
                                }),
                            }
                        );

                        const agentKitCallData3 = await agentKitCall3.json();
                        console.log(
                            "\x1b[38;5;214m",
                            agentKitCallData3,
                            "\x1b[0m"
                        );

                        const agentKitCall5 = await fetch(
                            this.agentKitApiEndpoint,
                            {
                                method: "POST",
                                body: JSON.stringify({
                                    userMessage:
                                        "what's your balance of token B?",
                                }),
                            }
                        );

                        const agentKitCallData5 = await agentKitCall5.json();
                        console.log(
                            "\x1b[38;5;214m",
                            agentKitCallData5,
                            "\x1b[0m"
                        );

                        //push response to the database
                        // /api/agent/response
                        const agentResponse = await fetch(
                            `${this.backendApiEndpoint}/api/agent/response`,
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    response: agentKitCallData3.response,
                                }),
                            }
                        );

                        console.log("\x1b[38;5;214m", agentResponse, "\x1b[0m");

                        const agentResponse2 = await fetch(
                            `${this.backendApiEndpoint}/api/agent/response`,
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    response: agentKitCallData5.response,
                                }),
                            }
                        );

                        console.log(
                            "\x1b[38;5;214m",
                            agentResponse2,
                            "\x1b[0m"
                        );

                        const tokenABalance = agentKitCallData3.response;

                        //make a call to the agent to know token A and token B balances
                        const agentKitCall4 = await fetch(
                            this.agentKitApiEndpoint,
                            {
                                method: "POST",
                                body: JSON.stringify({
                                    userMessage: `can you swap this percentage of token A balance is: ${tokenABalance} for some token B? ${tokenAPercentage}`,
                                }),
                            }
                        );

                        const agentKitCallData4 = await agentKitCall4.json();

                        console.log(
                            "\x1b[38;5;214m",
                            agentKitCallData4,
                            "\x1b[0m"
                        );

                        const agentResponse3 = await fetch(
                            `${this.backendApiEndpoint}/api/agent/response`,
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    response: agentKitCallData4.response,
                                }),
                            }
                        );

                        console.log(
                            "\x1b[38;5;214m",
                            agentResponse3,
                            "\x1b[0m"
                        );
                    }

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
