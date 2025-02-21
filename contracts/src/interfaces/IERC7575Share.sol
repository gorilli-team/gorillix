// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { IERC165 } from "@openzeppelin/contracts/interfaces/IERC165.sol";

interface IERC7575Share is IERC165 {
    event UpdateVault(address indexed asset, address vault);

    function updateVault(address asset, address vault_) external; 

    function vault(address asset) external view returns (address vault_);
}