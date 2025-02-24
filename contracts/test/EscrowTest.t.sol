// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { Test, console } from "forge-std/Test.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { Escrow } from "../src/Escrow.sol";
import { TokenA } from "../src/TokenA.sol";
import { TokenB } from "../src/TokenB.sol";

contract ExternalToken is ERC20 {
    constructor() ERC20("External Token", "EXT") {
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }
}

contract EscrowTest is Test {
    Escrow escrow;
    TokenA tokenA;
    TokenB tokenB;
    ExternalToken externalToken;

    address deployer = makeAddr("deployer");
    address user1 = makeAddr("user1");
    address aiAgent = makeAddr("aiAgent");

    uint256 constant APPROVED_AMOUNT = 1_000_000 * 10 ** 18;
    uint256 constant INIT_DEPOSIT = 10 * 10 ** 18;

    function setUp() public {
        vm.startPrank(deployer);
        tokenA = new TokenA();
        tokenB = new TokenB();
        externalToken = new ExternalToken();
        escrow = new Escrow(address(tokenA), address(tokenB));

        tokenA.approve(address(escrow), APPROVED_AMOUNT);
        tokenB.approve(address(escrow), APPROVED_AMOUNT);
        externalToken.approve(address(escrow), APPROVED_AMOUNT);
        vm.stopPrank();
    }

    function testCheckTokensAddresses() public view {
        IERC20 allowedTokenA = escrow.i_tokenA();
        IERC20 allowedTokenB = escrow.i_tokenB();

        address addressAllowedTokenA = address(allowedTokenA);
        address addressAllowedTokenB = address(allowedTokenB);

        console.log("TokenA allowed token: ", addressAllowedTokenA);
        console.log("TokenB allowed token: ", addressAllowedTokenB);
    }

    ///////////////////////////////////////
    /////////////// DEPOSIT ///////////////
    ///////////////////////////////////////

    function testDepositTokenA() public {
        uint256 deployerInitialBalance = tokenA.balanceOf(deployer);

        vm.prank(deployer);
        escrow.deposit(address(tokenA), INIT_DEPOSIT);

        assertEq(tokenA.balanceOf(address(escrow)), INIT_DEPOSIT);
        assertEq(tokenA.balanceOf(deployer), deployerInitialBalance - INIT_DEPOSIT);
    }

    function testDepositTokenB() public {
        uint256 deployerInitialBalance = tokenB.balanceOf(deployer);

        vm.prank(deployer);
        escrow.deposit(address(tokenB), INIT_DEPOSIT);

        assertEq(tokenB.balanceOf(address(escrow)), INIT_DEPOSIT);
        assertEq(tokenB.balanceOf(deployer), deployerInitialBalance - INIT_DEPOSIT);
    }

    function testDepositRevertsIfNotOwner() public {
        vm.prank(user1);
        vm.expectRevert();
        escrow.deposit(address(tokenA), INIT_DEPOSIT);
    }

    function testShouldNotAllowExternalTokenDeposit() public {
        vm.prank(deployer);
        vm.expectRevert(Escrow.Escrow__NotAllowedToken.selector);
        escrow.deposit(address(externalToken), INIT_DEPOSIT);
    }

    //////////////////////////////////////////////
    ///////////////// SET AI AGENT ///////////////
    //////////////////////////////////////////////

    function testSetAIAgent() public {
        vm.prank(deployer);
        escrow.setAIAgent(aiAgent);

        address currentAIAgent = escrow.s_aiAgent();

        assertEq(currentAIAgent, aiAgent);
    }

    function testRevertsIfAIAgentNotSet() public {
        vm.prank(deployer);
        escrow.deposit(address(tokenA), INIT_DEPOSIT);

        vm.prank(aiAgent);
        vm.expectRevert(Escrow.Escrow__AIAgentNotSet.selector);
        escrow.withdrawAIAgent(address(tokenA), INIT_DEPOSIT);
    }

    ////////////////////////////////////////////////
    ////////////// WITHDRAW AI AGENT ///////////////
    ////////////////////////////////////////////////

    function testWithdrawAIAgent() public {
        vm.startPrank(deployer);
        escrow.deposit(address(tokenA), INIT_DEPOSIT);
        escrow.setAIAgent(aiAgent);
        vm.stopPrank();

        vm.prank(aiAgent);
        escrow.withdrawAIAgent(address(tokenA), INIT_DEPOSIT);

        assertEq(tokenA.balanceOf(address(escrow)), 0);
        assertEq(tokenA.balanceOf(aiAgent), INIT_DEPOSIT);
    }

    function testWithdrawAIAgentRevertsIfNotCalledByAIAgent() public {
        vm.startPrank(deployer);
        escrow.deposit(address(tokenA), INIT_DEPOSIT);
        escrow.setAIAgent(aiAgent);
        vm.stopPrank();

        vm.prank(user1);
        vm.expectRevert(Escrow.Escrow__OnlyAIAgent.selector);
        escrow.withdrawAIAgent(address(tokenA), INIT_DEPOSIT);
    }

    //////////////////////////////////////////////
    /////////////// WITHDRAW OWNER ///////////////
    //////////////////////////////////////////////

    function testWithdrawOwner() public {
        uint256 deployerInitialBalance = tokenA.balanceOf(deployer);

        vm.startPrank(deployer);
        escrow.deposit(address(tokenA), INIT_DEPOSIT);
        vm.stopPrank();

        vm.prank(deployer);
        escrow.withdrawOwner(address(tokenA), INIT_DEPOSIT);

        assertEq(tokenA.balanceOf(deployer), deployerInitialBalance);
    }

    function testWithdrawOwnerRevertsWhenCalledByNonOwner() public {
        vm.startPrank(deployer);
        escrow.deposit(address(tokenA), INIT_DEPOSIT);
        escrow.setAIAgent(aiAgent);
        vm.stopPrank();

        vm.prank(aiAgent);
        vm.expectRevert();
        escrow.withdrawOwner(address(tokenA), INIT_DEPOSIT);
    }
}