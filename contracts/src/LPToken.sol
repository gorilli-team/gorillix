// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { IERC7575Share } from "./interfaces/IERC7575Share.sol";

contract LPToken is ERC20, IERC7575Share {
    mapping (address asset => address) s_vault;

    constructor(string memory lpTokenName, string memory lpTokenSymbol) ERC20(lpTokenName, lpTokenSymbol) {

    }

    function supportsInterface(bytes4 interfaceId) external pure returns(bool) {

    }

    ////////////////////////////////////////////////
    /////////////// PUBLIC FUNCTIONS ///////////////
    ////////////////////////////////////////////////

    function updateVault(address _asset, address _vault) public {
        emit UpdateVault(_asset, _vault);
    }

    ///////////////////////////////////////////////
    //////////////// VIEW FUNCTIONS ///////////////
    ///////////////////////////////////////////////

    /**
     * 
     * @param asset token elected as one of the assets of the multi-asset vault LPToken
     * @dev required by ERC7575
     */
    function vault(address asset) external view returns (address) {
        return s_vault[asset];
    }
}