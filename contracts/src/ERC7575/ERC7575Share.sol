// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { IERC7575Share } from "../interfaces/IERC7575Share.sol";

abstract contract ERC7575Share is IERC7575Share {
    mapping (address asset => address) private _vault;

    function updateVault(address _asset, address vault_) public virtual {
        _vault[_asset] = vault_;
        emit UpdateVault(_asset, vault_);
    }

    function vault(address _asset) external view virtual returns (address) {
        return _vault[_asset];
    }

    function supportsInterface(bytes4 interfaceId) external pure virtual returns (bool) {
        return interfaceId == 0xf815c03d || interfaceId == 0x01ffc9a7;
    }
}