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

    function testTokenAToTokenBSwap() public {
        vm.startPrank(deployer);
        tokenA.approve(address(gorillix), INIT_AMOUNT);
        tokenB.approve(address(gorillix), INIT_AMOUNT);
        gorillix.init(INIT_AMOUNT, INIT_AMOUNT);
        vm.stopPrank();

        console.log("User1 tokenA amount before swap: ", tokenA.balanceOf(user1));
        console.log("User1 tokenB amount before swap: ", tokenB.balanceOf(user1));

        uint256 totalLiquidityTokenABeforeSwap = gorillix.getTotalLiquidityTokenA();
        uint256 totalLiquidityTokenBBeforeSwap = gorillix.getTotalLiquidityTokenB();
        console.log("Total liquidity Token A before swap: ", totalLiquidityTokenABeforeSwap);
        console.log("Total liquidity Token B before swap: ", totalLiquidityTokenBBeforeSwap);

        vm.startPrank(user1);
        tokenA.approve(address(gorillix), 10000000000000000000);
        gorillix.tokenAtoTokenB(10000000000000000000);
        vm.stopPrank();

        console.log("User1 tokenA amount after swap: ", tokenA.balanceOf(user1));
        console.log("User1 tokenB amount after swap: ", tokenB.balanceOf(user1));

        console.log("Total liquidity Token A after swap: ", gorillix.getTotalLiquidityTokenA());
        console.log("Total liquidity Token B after swap: ", gorillix.getTotalLiquidityTokenB());

        assertEq(gorillix.getTotalLiquidityTokenA(), totalLiquidityTokenABeforeSwap + 10000000000000000000);
    }

    function testTokenBToTokenASwap() public {
        vm.startPrank(deployer);
        tokenA.approve(address(gorillix), INIT_AMOUNT);
        tokenB.approve(address(gorillix), INIT_AMOUNT);
        gorillix.init(INIT_AMOUNT, INIT_AMOUNT);
        vm.stopPrank();

        console.log("User1 tokenA amount before swap: ", tokenA.balanceOf(user1));
        console.log("User1 tokenB amount before swap: ", tokenB.balanceOf(user1));

        uint256 totalLiquidityTokenBBeforeSwap = gorillix.getTotalLiquidityTokenB();

        vm.startPrank(user1);
        tokenB.approve(address(gorillix), 10000000000000000000);
        gorillix.tokenBtoTokenA(10000000000000000000);
        vm.stopPrank();

        console.log("User1 tokenA amount after swap: ", tokenA.balanceOf(user1));
        console.log("User1 tokenB amount after swap: ", tokenB.balanceOf(user1));

        assertEq(gorillix.getTotalLiquidityTokenB(), totalLiquidityTokenBBeforeSwap + 10000000000000000000);
    }

    function testPriceChangesAfterSwappingTokens() public {
        vm.startPrank(deployer);
        tokenA.approve(address(gorillix), INIT_AMOUNT);
        tokenB.approve(address(gorillix), INIT_AMOUNT);
        gorillix.init(INIT_AMOUNT, INIT_AMOUNT);
        vm.stopPrank();

        // PRICE BEFORE SWAP
        uint256 xReservesBefore = gorillix.getTotalLiquidityTokenA();
        uint256 yReservesBefore = gorillix.getTotalLiquidityTokenB();

        uint256 yOutputBefore = gorillix.price(100 * 10 ** 18, xReservesBefore, yReservesBefore);

        console.log("yOutput before: ", yOutputBefore);

        // USER1 SWAPS 10 tokenA
        vm.startPrank(user1);
        tokenA.approve(address(gorillix), 10000000000000000000);
        gorillix.tokenAtoTokenB(10000000000000000000);
        vm.stopPrank();

        uint256 xReservesAfter = gorillix.getTotalLiquidityTokenA();
        uint256 yReservesAfter = gorillix.getTotalLiquidityTokenB();

        uint256 yOutputAfter = gorillix.price(100 * 10 ** 18, xReservesAfter, yReservesAfter);

        console.log("yOutput after: ", yOutputAfter);

        // The value of Token A has decreased, as there are more Token A in the reserve
        assert(yOutputAfter < yOutputBefore);
    }

    function testTokenBValueIncreasesAfterSwappingTokenAToTokenB() public {
        vm.startPrank(deployer);
        tokenA.approve(address(gorillix), INIT_AMOUNT);
        tokenB.approve(address(gorillix), INIT_AMOUNT);
        gorillix.init(INIT_AMOUNT, INIT_AMOUNT);
        vm.stopPrank();

        // PRICE BEFORE SWAP
        uint256 xReservesBefore = gorillix.getTotalLiquidityTokenA();
        uint256 yReservesBefore = gorillix.getTotalLiquidityTokenB();

        uint256 yOutputBefore = gorillix.price(100 * 10 ** 18, xReservesBefore, yReservesBefore);

        console.log("yOutput before: ", yOutputBefore);

        // USER1 SWAPS 10 tokenA
        vm.startPrank(user1);
        tokenA.approve(address(gorillix), 10000000000000000000);
        gorillix.tokenAtoTokenB(10000000000000000000);
        vm.stopPrank();

        uint256 xReservesAfter = gorillix.getTotalLiquidityTokenA();
        uint256 yReservesAfter = gorillix.getTotalLiquidityTokenB();

        uint256 yOutputAfter = gorillix.price(100 * 10 ** 18, yReservesAfter, xReservesAfter);

        console.log("yOutput after: ", yOutputAfter);

        // The value of Token B has increased, as there are less Token B in the reserve
        assert(yOutputAfter > yOutputBefore);
    }

    function testAddLiquidityTokenA() public {
        vm.startPrank(deployer);
        tokenA.approve(address(gorillix), INIT_AMOUNT);
        tokenB.approve(address(gorillix), INIT_AMOUNT);
        gorillix.init(INIT_AMOUNT, INIT_AMOUNT);
        vm.stopPrank();

        console.log("User1 tokenA balance before adding liquidity: ", tokenA.balanceOf(user1));
        console.log("User1 tokenB balance before adding liquidity: ", tokenB.balanceOf(user1));

        uint256 totalLiquidityTokenABeforeAddingLiquidity = gorillix.getTotalLiquidityTokenA();

        vm.startPrank(user1);
        tokenA.approve(address(gorillix), 10000000000000000000);
        tokenB.approve(address(gorillix), 10000000000000000000);
        gorillix.addLiquidityTokenA(10000000000000000000);
        vm.stopPrank();

        console.log("User1 tokenA balance after adding liquidity: ", tokenA.balanceOf(user1));
        console.log("User1 tokenB balance after adding liquidity: ", tokenB.balanceOf(user1));

        console.log("Gorillix tokenA balance after adding liquidity: ", tokenA.balanceOf(address(gorillix)));
        console.log("Gorillix tokenB balance after adding liquidity: ", tokenB.balanceOf(address(gorillix)));

        assertEq(gorillix.getTotalLiquidityTokenA(), totalLiquidityTokenABeforeAddingLiquidity + 10000000000000000000);
    }

    function testAddLiquidityTokenB() public {
        vm.startPrank(deployer);
        tokenA.approve(address(gorillix), INIT_AMOUNT);
        tokenB.approve(address(gorillix), INIT_AMOUNT);
        gorillix.init(INIT_AMOUNT, INIT_AMOUNT);
        vm.stopPrank();

        console.log("User1 tokenA balance before adding liquidity: ", tokenA.balanceOf(user1));
        console.log("User1 tokenB balance before adding liquidity: ", tokenB.balanceOf(user1));

        uint256 totalLiquidityTokenBBeforeAddingLiquidity = gorillix.getTotalLiquidityTokenA();

        vm.startPrank(user1);
        tokenA.approve(address(gorillix), 10000000000000000000);
        tokenB.approve(address(gorillix), 10000000000000000000);
        gorillix.addLiquidityTokenB(10000000000000000000);
        vm.stopPrank();

        console.log("User1 tokenA balance after adding liquidity: ", tokenA.balanceOf(user1));
        console.log("User1 tokenB balance after adding liquidity: ", tokenB.balanceOf(user1));

        console.log("Gorillix tokenA balance after adding liquidity: ", tokenA.balanceOf(address(gorillix)));
        console.log("Gorillix tokenB balance after adding liquidity: ", tokenB.balanceOf(address(gorillix)));

        assertEq(gorillix.getTotalLiquidityTokenB(), totalLiquidityTokenBBeforeAddingLiquidity + 10000000000000000000);
    }
}