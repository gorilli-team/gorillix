// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { Script } from "forge-std/Script.sol";
import { Faucet } from "../src/Faucet.sol";

contract DeployFaucet is Script {
    uint256 public constant FAUCET_AMOUNT = 10000000000000000000;
    address public constant TRUSTED_FORWARDER = 0x61F2976610970AFeDc1d83229e1E21bdc3D5cbE4;

    address public tokenA;
    address public tokenB;

    constructor(address _tokenA, address _tokenB) {
        tokenA = _tokenA;
        tokenB = _tokenB;
    }

    function run() external returns (Faucet) {
        vm.startBroadcast();
        Faucet faucet = new Faucet(tokenA, tokenB, FAUCET_AMOUNT, TRUSTED_FORWARDER);
        vm.stopBroadcast();

        return faucet;
    }
}