// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Gorillix {
    IERC20 public immutable i_tokenA;
    IERC20 public immutable i_tokenB;

    ////////////////////////////////////////////////
    //////////////// CUSTOM ERRORS /////////////////
    ////////////////////////////////////////////////

    // q is it better to specify that it is the liquidity to be initialized?
    // e.g. Gorillix__LiquidityAlreadyInitialized()?
    error Gorillix__AlreadyInitialized();
    error Gorillix__AmountMustBeGreaterThanZero();

    ////////////////////////////////////////////////
    /////////////////// EVENTS /////////////////////
    ////////////////////////////////////////////////

    event Initialized(address initializer, uint256 indexed amountTokenA, uint256 amountTokenB);

    ////////////////////////////////////////////////
    /////////////// STATE VARIABLES ////////////////
    ////////////////////////////////////////////////

    uint256 public s_totalLiquidityTokenA;
    uint256 public s_totalLiquidityTokenB;
    // q is it more appropriate to call it "s_liquidityPerUser"?
    mapping (address user => uint256 amount) public s_liquidity;

    /////////////////////////////////////////////////
    //////////////// CONSTRUCTOR ////////////////////
    /////////////////////////////////////////////////

    constructor(address _tokenA, address _tokenB) {
        i_tokenA = IERC20(_tokenA);
        i_tokenB = IERC20(_tokenB);
    }

    /////////////////////////////////////////////////
    ////////////// PUBLIC FUNCTIONS /////////////////
    /////////////////////////////////////////////////

    // q would it be useful to add a modifier to allow call to this function only once?
    function init(uint256 amountTokenA, uint256 amountTokenB) external {
        // i this check makes sure that whoever calls the init function is obliged to send both token (non-zero amount)
        if (amountTokenA == 0 || amountTokenB == 0) {
            revert Gorillix__AmountMustBeGreaterThanZero();
        }

        if (s_totalLiquidityTokenA != 0 && s_totalLiquidityTokenB != 0) {
            revert Gorillix__AlreadyInitialized();
        }
        
        s_totalLiquidityTokenA = i_tokenA.balanceOf(address(this));
        s_totalLiquidityTokenB = i_tokenB.balanceOf(address(this));

        i_tokenA.transferFrom(msg.sender, address(this), amountTokenA);
        i_tokenB.transferFrom(msg.sender, address(this), amountTokenB);

        emit Initialized(msg.sender, amountTokenA, amountTokenB);
    }


    // q what if someone sends token to the contract?

    
}