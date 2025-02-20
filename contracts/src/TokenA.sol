// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { Faucet } from "./Faucet.sol";

contract TokenA is ERC20 {
    Faucet public immutable i_faucet;

    constructor(address _faucet) ERC20("TokenA", "TKA") {
        i_faucet = Faucet(_faucet);
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
        _mint(address(i_faucet), 1_000_000 * 10 ** decimals());
    }
}