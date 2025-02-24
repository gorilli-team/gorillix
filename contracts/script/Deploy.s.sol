// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { Script } from "forge-std/Script.sol";
import { TokenA } from "../src/TokenA.sol";
import { TokenB } from "../src/TokenB.sol";
import { DeployTokenA } from "./DeployTokenA.s.sol";
import { DeployTokenB } from "./DeployTokenB.s.sol";
import { DeployFaucet } from "./DeployFaucet.s.sol";
import { DeployGorillix } from "./DeployGorillix.s.sol";
import { DeployEscrow } from "./DeployEscrow.s.sol";

contract Deploy is Script {
    TokenA tokenA;
    TokenB tokenB;

    function run() external {
        vm.startBroadcast();

        DeployTokenA deployTokenA = new DeployTokenA();
        tokenA = deployTokenA.run();

        DeployTokenB deployTokenB = new DeployTokenB();
        tokenB = deployTokenB.run();

        DeployFaucet deployFaucet = new DeployFaucet(address(tokenA), address(tokenB));
        deployFaucet.run();

        DeployGorillix deployGorillix = new DeployGorillix(address(tokenA), address(tokenB));
        deployGorillix.run();

        DeployEscrow deployEscrow = new DeployEscrow(address(tokenA), address(tokenB));
        deployEscrow.run();

        vm.stopBroadcast();
    }
}