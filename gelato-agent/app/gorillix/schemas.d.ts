import { z } from "zod";
/**
 * Input schema for request tokens action.
 */
export declare const RequestTokensSchema: z.ZodObject<{}>;
export declare const GetTotalLiquidityTokenASchema: z.ZodObject<{}>;
export declare const GetTotalLiquidityTokenBSchema: z.ZodObject<{}>;
export declare const GetTotalLiquidityTokenAPerUserSchema: z.ZodObject<{
    contractAddress: z.ZodString;
}, "strip", z.ZodTypeAny, {
    contractAddress: string;
}, {
    contractAddress: string;
}>;

export declare const GetTotalLiquidityTokenBPerUserSchema: z.ZodObject<{
    contractAddress: z.ZodString;
}, "strip", z.ZodTypeAny, {
    contractAddress: string;
}, {
    contractAddress: string;
}>;

export declare const GetLPTokensPerUserSchema: z.ZodObject<{
    contractAddress: z.ZodString;
}, "strip", z.ZodTypeAny, {
    contractAddress: string;
}, {
    contractAddress: string;
}>;

export declare const SwapTokenAToTokenBSchema: z.ZodObject<{
    amount: z.ZodType<bigint, z.ZodTypeDef, bigint>;
}, "strip", z.ZodTypeAny, {
    amount: bigint;
}, {
    amount: bigint;
}>;