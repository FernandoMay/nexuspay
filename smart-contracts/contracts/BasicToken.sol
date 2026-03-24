// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title BasicToken
 * @dev A basic ERC20 token with fixed parameters for testing Hedera deployment
 */
contract BasicToken is ERC20 {
    constructor() ERC20("Basic Token", "BASIC") {
        _mint(msg.sender, 1000000 * 10**8); // 1M tokens with 8 decimals
    }
    
    function decimals() public view virtual override returns (uint8) {
        return 8; // Standard for Hedera tokens
    }
}
