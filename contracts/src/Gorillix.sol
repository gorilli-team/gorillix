// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract Gorillix is Ownable {
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

    mapping (address user => uint256 amountTokenA) public s_liquidityTokenAPerUser;
    mapping (address user => uint256 amountTokenB) public s_liquidityTokenBPerUser;


    /////////////////////////////////////////////////
    //////////////// CONSTRUCTOR ////////////////////
    /////////////////////////////////////////////////

    constructor(address _tokenA, address _tokenB) Ownable(msg.sender) {
        i_tokenA = IERC20(_tokenA);
        i_tokenB = IERC20(_tokenB);
    }

    /////////////////////////////////////////////////
    ////////////// PUBLIC FUNCTIONS /////////////////
    /////////////////////////////////////////////////

    // q would it be useful to add a modifier to allow call to this function only once?

    // WHAT IF instead of a single function initializing both token, we create two separate functions?
    // this single init function was thought for initializing ETH and another ERC20 token, BUT NOT BOTH ERC20s

    // q does it need a return value?
    function init(uint256 amountTokenA, uint256 amountTokenB) external {
        // i this check makes sure that whoever calls the init function is obliged to send both token (non-zero amount)
        if (amountTokenA == 0 || amountTokenB == 0) {
            revert Gorillix__AmountMustBeGreaterThanZero();
        }

        if (s_totalLiquidityTokenA != 0 && s_totalLiquidityTokenB != 0) {
            revert Gorillix__AlreadyInitialized();
        }

        s_totalLiquidityTokenA = amountTokenA;
        s_totalLiquidityTokenB = amountTokenB;

        s_liquidityTokenAPerUser[msg.sender] = amountTokenA;
        s_liquidityTokenBPerUser[msg.sender] = amountTokenB;

        i_tokenA.transferFrom(msg.sender, address(this), amountTokenA);
        i_tokenB.transferFrom(msg.sender, address(this), amountTokenB);

        emit Initialized(msg.sender, amountTokenA, amountTokenB);
    }

    // i we call it x and y because user can swap tokenA for tokenB,
    // but also tokenB for tokenA
    // i we account for a 0.3% fee on xInput
    function price(uint256 xInput, uint256 xReserves, uint256 yReserves) public pure returns(uint256 yOutput) {
        uint256 xInputWithFee = xInput * 997;
        uint256 numerator = xInputWithFee * yReserves;
        uint256 denominator = (xReserves * 1000) + xInputWithFee;
        return (numerator / denominator);
    }


    // q what if someone sends token to the contract?

    //////////////////////////////////////////////
    ////////////// VIEW FUNCTIONS ////////////////
    //////////////////////////////////////////////
    function getTotalLiquidityTokenA() public view returns(uint256) {
        return s_totalLiquidityTokenA;
    }

    function getTotalLiquidityTokenB() public view returns(uint256) {
        return s_totalLiquidityTokenB;
    }

    function getLiquidityTokenAPerUser(address user) public view returns(uint256) {
        return s_liquidityTokenAPerUser[user];
    }

    function getLiquidityTokenBPerUser(address user) public view returns(uint256) {
        return s_liquidityTokenBPerUser[user];
    }
}