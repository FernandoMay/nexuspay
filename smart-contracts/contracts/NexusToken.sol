// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title NexusToken
 * @dev Tokenized currency representation on Hedera
 * Each token represents a fiat currency (MXN.x, PEN.x, USD.x, etc.)
 */
contract NexusToken is ERC20, Ownable {
    // Currency backing info
    string public currencyCode; // MXN, PEN, USD, etc.
    uint256 public backingRatio; // 100 = 1:1, 105 = 5% overcollateralized
    
    event Minted(address indexed to, uint256 amount);
    event Burned(address indexed from, uint256 amount);
    event BackingUpdated(uint256 newRatio);
    
    constructor(
        string memory _name,
        string memory _symbol,
        string memory _currencyCode
    ) ERC20(_name, _symbol) Ownable(msg.sender) {
        currencyCode = _currencyCode;
        backingRatio = 100;
    }
    
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
        emit Minted(to, amount);
    }
    
    function burn(address from, uint256 amount) external onlyOwner {
        _burn(from, amount);
        emit Burned(from, amount);
    }
    
    function updateBackingRatio(uint256 newRatio) external onlyOwner {
        require(newRatio >= 80 && newRatio <= 120, "Invalid backing ratio");
        backingRatio = newRatio;
        emit BackingUpdated(newRatio);
    }
    
    function decimals() public view virtual override returns (uint8) {
        return 8; // Standard for Hedera tokens
    }
}
