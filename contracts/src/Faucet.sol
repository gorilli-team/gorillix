// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { ERC2771Context } from "@gelatonetwork/relay-context/contracts/vendor/ERC2771Context.sol";
import { Context } from "@openzeppelin/contracts/utils/Context.sol";

contract Faucet is Ownable, ERC2771Context {

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

    constructor(address _tokenA, address _tokenB, uint256 _faucetAmount, address trustedForwarder) Ownable(msg.sender) ERC2771Context(trustedForwarder) {
        i_tokenA = IERC20(_tokenA);
        i_tokenB = IERC20(_tokenB);

        s_faucetAmount = _faucetAmount;
    }

    /////////////////////////////////////////////////
    ////////////// EXTERNAL FUNCTIONS ///////////////
    /////////////////////////////////////////////////

    /**
     * @dev the faucet will transfer the same amount of TokenA and TokenB to msg.sender
     */
    function requestFaucet() external {
        uint256 faucetTokenAAmount = i_tokenA.balanceOf(address(this));
        uint256 faucetTokenBAmount = i_tokenB.balanceOf(address(this));
        if (faucetTokenAAmount < s_faucetAmount || faucetTokenBAmount < s_faucetAmount) {
            revert Faucet__InsufficientBalance();
        }

        // q is it better to use safeTransferFrom?
        i_tokenA.transfer(msg.sender, s_faucetAmount);
        i_tokenB.transfer(msg.sender, s_faucetAmount);

        emit RequestFaucet(msg.sender, s_faucetAmount, s_faucetAmount);
    }

    function setFaucetAmount(uint256 _newFaucetAmount) external onlyOwner {
        s_faucetAmount = _newFaucetAmount;
        emit SetFaucetAmount(_newFaucetAmount);
    }

    //////////////////////////////////////////////
    //////////// INTERNAL FUNCTIONS //////////////
    //////////////////////////////////////////////

    function _msgSender() internal view override(ERC2771Context, Context) returns(address sender) {
        return ERC2771Context._msgSender();
    }

    function _msgData() internal view override(ERC2771Context, Context) returns(bytes calldata) {
        return ERC2771Context._msgData();
    }
}