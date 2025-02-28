import {
    type Content,
    type IAgentRuntime,
    type IImageDescriptionService,
    type Memory,
    type State,
    type UUID,
    getEmbeddingZeroVector,
    elizaLogger,
    stringToUuid,
    ActionTimelineType,
} from "@elizaos/core";

import { EventEmitter } from "events";

export function extractAnswer(text: string): string {
    const startIndex = text.indexOf("Answer: ") + 8;
    const endIndex = text.indexOf("<|endoftext|>", 11);
    return text.slice(startIndex, endIndex);
}

type TwitterProfile = {
    id: string;
    username: string;
    screenName: string;
    bio: string;
    nicknames: string[];
};

class RequestQueue {
    private queue: (() => Promise<any>)[] = [];
    private processing = false;

    async add<T>(request: () => Promise<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            this.queue.push(async () => {
                try {
                    const result = await request();
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            });
            this.processQueue();
        });
    }

    private async processQueue(): Promise<void> {
        if (this.processing || this.queue.length === 0) {
            return;
        }
        this.processing = true;

        while (this.queue.length > 0) {
            const request = this.queue.shift()!;
            try {
                await request();
            } catch (error) {
                console.error("Error processing request:", error);
                this.queue.unshift(request);
                await this.exponentialBackoff(this.queue.length);
            }
            await this.randomDelay();
        }

        this.processing = false;
    }

    private async exponentialBackoff(retryCount: number): Promise<void> {
        const delay = Math.pow(2, retryCount) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
    }

    private async randomDelay(): Promise<void> {
        const delay = Math.floor(Math.random() * 2000) + 1500;
        await new Promise((resolve) => setTimeout(resolve, delay));
    }
}

export class ClientBase extends EventEmitter {
    runtime: IAgentRuntime;
    directions: string;
    lastCheckedTweetId: bigint | null = null;
    imageDescriptionService: IImageDescriptionService;
    temperature = 0.5;

    requestQueue: RequestQueue = new RequestQueue();

    profile: null;

    callback: (self: ClientBase) => any = null;

    onReady() {
        throw new Error(
            "Not implemented in base class, please call from subclass"
        );
    }

    constructor(runtime: IAgentRuntime) {
        super();
        this.runtime = runtime;

        this.directions =
            "- " +
            this.runtime.character.style.all.join("\n- ") +
            "- " +
            this.runtime.character.style.post.join();
    }
}
