// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { Test, console } from "forge-std/Test.sol";
import { TokenA } from "../src/TokenA.sol";
import { TokenB } from "../src/TokenB.sol";
import { Faucet } from "../src/Faucet.sol";

contract FaucetTest is Test {
    Faucet faucet;
    TokenA tokenA;
    TokenB tokenB;

    address deployer = makeAddr("deployer");
    address user1 = makeAddr("user1");

    uint256 public INITIAL_FAUCET_AMOUNT = 10000000000000000000; // 10 token
    uint256 public FAUCET_DEPOSIT = 500_000 * 10 ** 18;

    function setUp() public {
        vm.startPrank(deployer);
        tokenA = new TokenA();
        tokenB = new TokenB();
        faucet = new Faucet(address(tokenA), address(tokenB), INITIAL_FAUCET_AMOUNT);

        tokenA.transfer(address(faucet), FAUCET_DEPOSIT);
        tokenB.transfer(address(faucet), FAUCET_DEPOSIT);

        vm.stopPrank();
    }

    //////////////////////////////////////////////////
    /////////// CONTRACTS INIITIALIZATION ////////////
    //////////////////////////////////////////////////

    function testInitializeTokenA() public view {
        assertEq(tokenA.name(), "TokenA");
        assertEq(tokenA.symbol(), "TKA");
    }

    function testInitializeTokenB() public view {
        assertEq(tokenB.name(), "TokenB");
        assertEq(tokenB.symbol(), "TKB");
    }

    function testFaucetInitialBalance() public view {
        assertEq(tokenA.balanceOf(address(faucet)), FAUCET_DEPOSIT);
        assertEq(tokenB.balanceOf(address(faucet)), FAUCET_DEPOSIT);
    }

    /////////////////////////////////////////////////
    /////////////// SET FAUCET AMOUNT ///////////////
    /////////////////////////////////////////////////

    function testSetFaucetAmount() public {
        vm.prank(deployer);
        faucet.setFaucetAmount(INITIAL_FAUCET_AMOUNT + 1);

        uint256 newFaucetAmount = faucet.s_faucetAmount();

        assertEq(newFaucetAmount, INITIAL_FAUCET_AMOUNT + 1);
    }

    function testRevertsWhenNonOwnerSetsFaucetAmount() public {
        vm.prank(user1);
        vm.expectRevert();
        faucet.setFaucetAmount(INITIAL_FAUCET_AMOUNT + 1);
    }
}