// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { Test, console } from "forge-std/Test.sol";
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

    uint256 constant INIT_AMOUNT = 500_000 * 10 ** 18;

    function setUp() public {
        vm.startPrank(deployer);
        tokenA = new TokenA();
        tokenB = new TokenB();
        gorillix = new Gorillix(address(tokenA), address(tokenB));

        tokenA.transfer(user1, INIT_AMOUNT);
        tokenB.transfer(user1, INIT_AMOUNT);

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
        assertEq(tokenA.balanceOf(user1), INIT_AMOUNT);
        assertEq(tokenB.balanceOf(user1), INIT_AMOUNT);
    }

    function testGorillixInit() public {
        vm.startPrank(user1);
        tokenA.approve(address(gorillix), INIT_AMOUNT);
        tokenB.approve(address(gorillix), INIT_AMOUNT);
        gorillix.init(INIT_AMOUNT, INIT_AMOUNT);
        vm.stopPrank();

        assertEq(tokenA.balanceOf(address(gorillix)), INIT_AMOUNT);
        assertEq(tokenB.balanceOf(address(gorillix)), INIT_AMOUNT);
    }

    function testInitRevertsIfCalledTwice() public {
        vm.startPrank(user1);
        tokenA.approve(address(gorillix), INIT_AMOUNT);
        tokenB.approve(address(gorillix), INIT_AMOUNT);
        gorillix.init(INIT_AMOUNT / 2, INIT_AMOUNT / 2);
        vm.stopPrank();

        vm.prank(user1);
        vm.expectRevert(Gorillix.Gorillix__AlreadyInitialized.selector);
        gorillix.init(INIT_AMOUNT / 2, INIT_AMOUNT / 2);
    }

    function testPriceAfterInit() public {
        vm.startPrank(user1);
        tokenA.approve(address(gorillix), INIT_AMOUNT);
        tokenB.approve(address(gorillix), INIT_AMOUNT);
        gorillix.init(INIT_AMOUNT, INIT_AMOUNT);
        vm.stopPrank();

        uint256 xReserves = gorillix.getTotalLiquidityTokenA();
        uint256 yReserves = gorillix.getTotalLiquidityTokenB();

        // We want to see of many TokenB we receive if we swap 100 TokenA
        uint256 yOutput = gorillix.price(100 * 10 ** 18, xReserves, yReserves);

        console.log("If we swap 100 TokenA, we receive: ", yOutput, " TokenB");
    }
}