// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { Context } from "@openzeppelin/contracts/utils/Context.sol";
import { ERC2771Context } from "@gelatonetwork/relay-context/contracts/vendor/ERC2771Context.sol";
import { Math } from "@openzeppelin/contracts/utils/math/Math.sol";

contract Gorillix is Ownable, ERC2771Context, ERC20 {
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
    event TokenAtoTokenBSwap(address indexed user, uint256 indexed amountTokenA, uint256 indexed outputTokenB);
    event TokenBtoTokenASwap(address indexed user, uint256 indexed amountTokenB, uint256 indexed outputTokenA);
    event AddLiquidity(address indexed liquidityProvider, uint256 indexed amountTokenA, uint256 indexed amountTokenB);

    ////////////////////////////////////////////////
    /////////////// STATE VARIABLES ////////////////
    ////////////////////////////////////////////////

    // are they really useful? or it is sufficient to call the balance?
    uint256 public s_totalLiquidityTokenA;
    uint256 public s_totalLiquidityTokenB;

    // do we intend these as the liquidity tokens?
    mapping (address user => uint256 amountTokenA) public s_liquidityTokenAPerUser;
    mapping (address user => uint256 amountTokenB) public s_liquidityTokenBPerUser;


    /////////////////////////////////////////////////
    //////////////// CONSTRUCTOR ////////////////////
    /////////////////////////////////////////////////

    constructor(address _tokenA, address _tokenB, address trustedForwarder, string memory lpTokenName, string memory lpTokenSymbol) Ownable(msg.sender) ERC2771Context(trustedForwarder) ERC20(lpTokenName, lpTokenSymbol) {
        i_tokenA = IERC20(_tokenA);
        i_tokenB = IERC20(_tokenB);
    }

    /////////////////////////////////////////////////
    ////////////// EXTERNAL FUNCTIONS ///////////////
    /////////////////////////////////////////////////

    function init(uint256 amountTokenA, uint256 amountTokenB) external onlyOwner {
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
        _mint(msg.sender, _calculateLPTokensInit(amountTokenA, amountTokenB));

        emit Initialized(msg.sender, amountTokenA, amountTokenB);
    }

    function tokenAtoTokenB(uint256 amountTokenA) external returns(uint256 outputTokenB) {
        if (amountTokenA == 0) {
            revert Gorillix__AmountMustBeGreaterThanZero();
        }
        uint256 reservesTokenA = s_totalLiquidityTokenA;
        uint256 reservesTokenB = s_totalLiquidityTokenB;

        outputTokenB = price(amountTokenA, reservesTokenA, reservesTokenB);
        s_totalLiquidityTokenA += amountTokenA;
        s_totalLiquidityTokenB -= outputTokenB;

        i_tokenA.transferFrom(msg.sender, address(this), amountTokenA);
        i_tokenB.transfer(msg.sender, outputTokenB);

        emit TokenAtoTokenBSwap(msg.sender, amountTokenA, outputTokenB);
        return outputTokenB;
    }

    function tokenBtoTokenA(uint256 amountTokenB) external returns(uint256 outputTokenA) {
        if (amountTokenB == 0) {
            revert Gorillix__AmountMustBeGreaterThanZero();
        }
        uint256 reservesTokenA = s_totalLiquidityTokenA;
        uint256 reservesTokenB = s_totalLiquidityTokenB;

        outputTokenA = price(amountTokenB, reservesTokenB, reservesTokenA);
        s_totalLiquidityTokenB += amountTokenB;
        s_totalLiquidityTokenA -= outputTokenA;

        i_tokenB.transferFrom(msg.sender, address(this), amountTokenB);
        i_tokenA.transfer(msg.sender, outputTokenA);

        emit TokenBtoTokenASwap(msg.sender, amountTokenB, outputTokenA);
        return outputTokenA;
    }

    function addLiquidityTokenA(uint256 amountTokenA) external returns(uint256 amountTokenB) {
        if (amountTokenA == 0) {
            revert Gorillix__AmountMustBeGreaterThanZero();
        }
        uint256 reservesTokenA = s_totalLiquidityTokenA;
        uint256 reservesTokenB = s_totalLiquidityTokenB;

        // info some argue that would be better to add 1 to reduce slippage
        // for tokens having 18 decimals is negligible, if we were working with USDC, which has 6 decimals
        // rounding errors would have a more profound impact
        // in alternative we could use the ceilDiv function from openzeppelin Math library
        amountTokenB = (amountTokenA * reservesTokenB) / reservesTokenA;

        s_totalLiquidityTokenA += amountTokenA;
        s_totalLiquidityTokenB += amountTokenB;
        s_liquidityTokenAPerUser[msg.sender] += amountTokenA;
        s_liquidityTokenBPerUser[msg.sender] += amountTokenB;

        i_tokenA.transferFrom(msg.sender, address(this), amountTokenA);
        i_tokenB.transferFrom(msg.sender, address(this), amountTokenB);

        emit AddLiquidity(msg.sender, amountTokenA, amountTokenB);
    }

    function addLiquidityTokenB(uint256 amountTokenB) external returns(uint256 amountTokenA) {
        if (amountTokenB == 0) {
            revert Gorillix__AmountMustBeGreaterThanZero();
        }
        uint256 reservesTokenA = s_totalLiquidityTokenA;
        uint256 reservesTokenB = s_totalLiquidityTokenB;

        // info same as above
        amountTokenA = (amountTokenB * reservesTokenA) / reservesTokenB;

        s_totalLiquidityTokenA += amountTokenA;
        s_totalLiquidityTokenB += amountTokenB;
        s_liquidityTokenAPerUser[msg.sender] += amountTokenA;
        s_liquidityTokenBPerUser[msg.sender] += amountTokenB;

        i_tokenA.transferFrom(msg.sender, address(this), amountTokenA);
        i_tokenB.transferFrom(msg.sender, address(this), amountTokenB);

        emit AddLiquidity(msg.sender, amountTokenA, amountTokenB);
    }

    //////////////////////////////////////////////
    ////////////// PURE FUNCTIONS ////////////////
    //////////////////////////////////////////////

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
    //////////// INTERNAL FUNCTIONS //////////////
    //////////////////////////////////////////////

    function _msgSender() internal view override(ERC2771Context, Context) returns (address sender) {
        return ERC2771Context._msgSender();
    }

    function _msgData() internal view override(ERC2771Context, Context) returns (bytes calldata) {
        return ERC2771Context._msgData();
    }

    function _calculateLPTokensInit(uint256 amountTokenA, uint256 amountTokenB) internal pure returns (uint256 amountLPTokens) {
        return Math.sqrt(amountTokenA) * Math.sqrt(amountTokenB);
    }

    //////////////////////////////////////////////
    ////////////// VIEW FUNCTIONS ////////////////
    //////////////////////////////////////////////
    function getTotalLiquidityTokenA() external view returns(uint256) {
        return s_totalLiquidityTokenA;
    }

    function getTotalLiquidityTokenB() external view returns(uint256) {
        return s_totalLiquidityTokenB;
    }

    function getLiquidityTokenAPerUser(address user) external view returns(uint256) {
        return s_liquidityTokenAPerUser[user];
    }

    function getLiquidityTokenBPerUser(address user) external view returns(uint256) {
        return s_liquidityTokenBPerUser[user];
    }

    function getLPTokensInit(uint256 amountTokenA, uint256 amountTokenB) external pure returns(uint256) {
        return _calculateLPTokensInit(amountTokenA, amountTokenB);
    }
}