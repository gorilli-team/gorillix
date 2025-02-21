// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { ERC7575Share } from "./ERC7575/ERC7575Share.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract LPToken is ERC20, ERC7575Share, Ownable {
    constructor(string memory lpTokenName, string memory lpTokenSymbol, address tokenA, address tokenAVault, address tokenB, address tokenBVault) ERC20(lpTokenName, lpTokenSymbol) Ownable(msg.sender) {
        updateVault(tokenA, tokenAVault);
        updateVault(tokenB, tokenBVault);
    }

    // overridden with onlyOwner modifier
    function updateVault(address _asset, address vault_) public override onlyOwner {
        super.updateVault(_asset, vault_);
    }
}