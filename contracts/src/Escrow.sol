// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract Escrow is Ownable {

    ////////////////////////////////////////////////
    //////////////// CUSTOM ERRORS /////////////////
    ////////////////////////////////////////////////

    error Escrow__NotAllowedToken();
    error Escrow__AIAgentNotSet();
    error Escrow__OnlyAIAgent();

    ////////////////////////////////////////////////
    /////////////////// EVENTS /////////////////////
    ////////////////////////////////////////////////

    event Deposit(address indexed user, uint256 indexed amount);
    event WithdrawAIAgent(address indexed aiAgent, uint256 indexed amount);
    event WithdrawOwner(address indexed owner, uint256 amount);

    ////////////////////////////////////////////////
    /////////////// STATE VARIABLES ////////////////
    ////////////////////////////////////////////////

    IERC20 public immutable i_tokenA;
    IERC20 public immutable i_tokenB;

    address public s_aiAgent;

    //////////////////////////////////////////////
    ////////////////// MODIFIERS /////////////////
    //////////////////////////////////////////////

    modifier onlyAIAgent() {
        if (s_aiAgent == address(0)) {
            revert Escrow__AIAgentNotSet();
        }
        if (msg.sender != s_aiAgent) {
            revert Escrow__OnlyAIAgent();
        }
        _;
    }

    modifier onlyAllowedTokens(address _token) {
        if (_token != address(i_tokenA) && _token != address(i_tokenB)) {
            revert Escrow__NotAllowedToken();
        }
        _;
    }

    /////////////////////////////////////////////////
    //////////////// CONSTRUCTOR ////////////////////
    /////////////////////////////////////////////////

    constructor(address _tokenA, address _tokenB) Ownable(msg.sender) {
        i_tokenA = IERC20(_tokenA);
        i_tokenB = IERC20(_tokenB);
    }

    /////////////////////////////////////////////////
    //////////////// PUBLIC FUNCTIONS ///////////////
    /////////////////////////////////////////////////


    function deposit(address _token, uint256 _amount) public onlyOwner onlyAllowedTokens(_token) {
        IERC20 token = IERC20(_token);
        token.transferFrom(msg.sender, address(this), _amount);
        emit Deposit(msg.sender, _amount);
    }

    function withdrawAIAgent(address _token, uint256 _amount) public onlyAIAgent onlyAllowedTokens(_token) {
        IERC20 token = IERC20(_token);
        token.transfer(msg.sender, _amount);
        emit WithdrawAIAgent(msg.sender, _amount);
    }

    function withdrawOwner(address _token, uint256 _amount) public onlyOwner {
        IERC20 token = IERC20(_token);
        token.transfer(msg.sender, _amount);
        emit WithdrawOwner(msg.sender, _amount);
    }

    function setAIAgent(address _aiAgent) public onlyOwner {
        s_aiAgent = _aiAgent;
    }
}