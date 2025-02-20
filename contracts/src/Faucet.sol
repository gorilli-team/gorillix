// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Faucet is Ownable {

    ////////////////////////////////////////////////
    //////////////// CUSTOM ERRORS /////////////////
    ////////////////////////////////////////////////

    // info if tokens in faucet finish
    // the deployer could transfer some other tokens
    // they have been minted 1 million tokenA and tokenB at deploy
    error Faucet__InsufficientBalance();

    ////////////////////////////////////////////////
    /////////////////// EVENTS /////////////////////
    ////////////////////////////////////////////////

    event SetFaucetAmount(uint256 indexed newFaucetAmount);
    event RequestFaucet(address indexed user, uint256 indexed amountTokenA, uint256 indexed amountTokenB);

    ////////////////////////////////////////////////
    /////////////// STATE VARIABLES ////////////////
    ////////////////////////////////////////////////

    IERC20 public immutable i_tokenA;
    IERC20 public immutable i_tokenB;

    uint256 public s_faucetAmount;

    /////////////////////////////////////////////////
    //////////////// CONSTRUCTOR ////////////////////
    /////////////////////////////////////////////////

    constructor(address _tokenA, address _tokenB, uint256 _faucetAmount) Ownable(msg.sender) {
        i_tokenA = IERC20(_tokenA);
        i_tokenB = IERC20(_tokenB);

        s_faucetAmount = _faucetAmount;
    }

    /////////////////////////////////////////////////
    ////////////// EXTERNAL FUNCTIONS ///////////////
    /////////////////////////////////////////////////

    // with an onchain faucet the user will need some native token to pay for gas fees
    function requestFaucet() external {
        uint256 faucetTokenAAmount = i_tokenA.balanceOf(address(this));
        uint256 faucetTokenBAmount = i_tokenB.balanceOf(address(this));
        if (faucetTokenAAmount < s_faucetAmount || faucetTokenBAmount < s_faucetAmount) {
            revert Faucet__InsufficientBalance();
        }

        // q is it better to use safeTransferFrom?
        i_tokenA.transferFrom(address(this), msg.sender, s_faucetAmount);
        i_tokenB.transferFrom(address(this), msg.sender, s_faucetAmount);

        emit RequestFaucet(msg.sender, s_faucetAmount, s_faucetAmount);
    }

    function setFaucetAmount(uint256 _newFaucetAmount) external onlyOwner {
        s_faucetAmount = _newFaucetAmount;
        emit SetFaucetAmount(_newFaucetAmount);
    }
}