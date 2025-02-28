// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { Script } from "forge-std/Script.sol";
import { Escrow } from "../src/Escrow.sol";

contract DeployEscrow is Script {
    address public constant TRUSTED_FORWARDER = 0xd8253782c45a12053594b9deB72d8e8aB2Fca54c;

    address public tokenA;
    address public tokenB;

    constructor(address _tokenA, address _tokenB) {
        tokenA = _tokenA;
        tokenB = _tokenB;
    }

    function run() external returns (Escrow) {
        vm.startBroadcast();
        Escrow escrow = new Escrow(tokenA, tokenB, TRUSTED_FORWARDER);
        vm.stopBroadcast();

        return escrow;
    }
}