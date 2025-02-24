// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { Script } from "forge-std/Script.sol";
import { TokenB } from "../src/TokenB.sol";

contract DeployTokenB is Script {
    function run() external returns(TokenB) {
        vm.startBroadcast();
        TokenB tokenB = new TokenB();
        vm.stopBroadcast();

        return tokenB;
    } 
}