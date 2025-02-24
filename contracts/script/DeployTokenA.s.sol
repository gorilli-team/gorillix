// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { Script } from "forge-std/Script.sol";
import { TokenA } from "../src/TokenA.sol";

contract DeployTokenA is Script {
    function run() external returns(TokenA) {
        vm.startBroadcast();
        TokenA tokenA = new TokenA();
        vm.stopBroadcast();

        return tokenA;
    } 
}