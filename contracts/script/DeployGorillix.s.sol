// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { Script } from "forge-std/Script.sol";
import { Gorillix } from "../src/Gorillix.sol";

contract DeployGorillix is Script {
    address public constant TRUSTED_FORWARDER = 0x61F2976610970AFeDc1d83229e1E21bdc3D5cbE4;

    address public tokenA;
    address public tokenB;

    constructor(address _tokenA, address _tokenB) {
        tokenA = _tokenA;
        tokenB = _tokenB;
    }

    function run() external returns (Gorillix) {
        vm.startBroadcast();
        Gorillix gorillix = new Gorillix(tokenA, tokenB, TRUSTED_FORWARDER, "Gorillix TokenA/TokenB", "GOR-LP");
        vm.stopBroadcast();

        return gorillix;
    }
}