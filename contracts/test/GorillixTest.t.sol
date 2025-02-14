// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { Test } from "forge-std/Test.sol";
import { TokenA } from "../src/TokenA.sol";
import { TokenB } from "../src/TokenB.sol";
import { Gorillix } from "../src/Gorillix.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract GorillixTest is Test {
    Gorillix gorillix;
    TokenA tokenA;
    TokenB tokenB;

    address deployer = makeAddr("deployer");
    address user1 = makeAddr("user1");
    address user2 = makeAddr("user2");

    uint256 constant INITIAL_AMOUNT_USER1 = 500_000 * 10 ** 18;

    function setUp() public {
        vm.startPrank(deployer);
        tokenA = new TokenA();
        tokenB = new TokenB();
        gorillix = new Gorillix(address(tokenA), address(tokenB));

        tokenA.transfer(user1, INITIAL_AMOUNT_USER1);
        tokenB.transfer(user2, INITIAL_AMOUNT_USER1);

        vm.stopPrank();
    }

    function testInitializeTokenA() public view {
        assertEq(tokenA.name(), "TokenA");
        assertEq(tokenA.symbol(), "TKA");
    }

    function testInitializeTokenB() public view {
        assertEq(tokenB.name(), "TokenB");
        assertEq(tokenB.symbol(), "TKB");
    }

    function testInitialTransfersToUser1() public view {
        assertEq(tokenA.balanceOf(user1), INITIAL_AMOUNT_USER1);
        assertEq(tokenB.balanceOf(user2), INITIAL_AMOUNT_USER1);
    }
}