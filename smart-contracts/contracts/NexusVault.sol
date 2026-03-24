// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title NexusVault
 * @dev Yield-generating vault for Nexus Pay
 * Integrates with Bonzo Finance for DeFi yield
 */
contract NexusVault is Ownable, ReentrancyGuard {
    
    // User deposits
    mapping(address => mapping(string => uint256)) public deposits;
    mapping(address => mapping(string => uint256)) public depositTimestamp;
    
    // Vault totals
    mapping(string => uint256) public totalDeposits;
    
    // APY per currency
    mapping(string => uint256) public currencyAPY;
    
    // Supported currencies
    string[] public supportedCurrencies;
    
    // Events
    event Deposited(address indexed user, string currency, uint256 amount);
    event Withdrawn(address indexed user, string currency, uint256 amount, uint256 yield);
    event APYUpdated(string currency, uint256 newAPY);
    
    constructor() Ownable(msg.sender) {
        supportedCurrencies = ["MXN", "PEN", "USD", "EUR", "BRL"];
        
        currencyAPY["MXN"] = 420;
        currencyAPY["PEN"] = 380;
        currencyAPY["USD"] = 450;
        currencyAPY["EUR"] = 400;
        currencyAPY["BRL"] = 500;
    }
    
    function deposit(string memory currency, uint256 amount) external nonReentrant {
        require(isSupportedCurrency(currency), "Currency not supported");
        require(amount > 0, "Amount must be greater than 0");
        
        deposits[msg.sender][currency] += amount;
        depositTimestamp[msg.sender][currency] = block.timestamp;
        totalDeposits[currency] += amount;
        
        emit Deposited(msg.sender, currency, amount);
    }
    
    function withdraw(string memory currency) external nonReentrant returns (uint256 totalAmount) {
        require(isSupportedCurrency(currency), "Currency not supported");
        
        uint256 deposited = deposits[msg.sender][currency];
        require(deposited > 0, "No deposits for this currency");
        
        uint256 yieldEarned = calculateYield(msg.sender, currency);
        totalAmount = deposited + yieldEarned;
        
        deposits[msg.sender][currency] = 0;
        depositTimestamp[msg.sender][currency] = 0;
        totalDeposits[currency] -= deposited;
        
        emit Withdrawn(msg.sender, currency, deposited, yieldEarned);
        
        return totalAmount;
    }
    
    function calculateYield(address user, string memory currency) public view returns (uint256) {
        uint256 deposited = deposits[user][currency];
        if (deposited == 0) return 0;
        
        uint256 timestamp = depositTimestamp[user][currency];
        uint256 timeElapsed = block.timestamp - timestamp;
        
        uint256 apy = currencyAPY[currency];
        
        uint256 secondsPerYear = 31536000;
        return (deposited * apy * timeElapsed) / (10000 * secondsPerYear);
    }
    
    function getUserBalance(address user, string memory currency) external view returns (uint256) {
        return deposits[user][currency] + calculateYield(user, currency);
    }
    
    function setAPY(string memory currency, uint256 newAPY) external onlyOwner {
        require(isSupportedCurrency(currency), "Currency not supported");
        require(newAPY <= 2000, "APY cannot exceed 20%");
        
        currencyAPY[currency] = newAPY;
        emit APYUpdated(currency, newAPY);
    }
    
    function isSupportedCurrency(string memory currency) public view returns (bool) {
        for (uint256 i = 0; i < supportedCurrencies.length; i++) {
            if (keccak256(bytes(supportedCurrencies[i])) == keccak256(bytes(currency))) {
                return true;
            }
        }
        return false;
    }
    
    function getSupportedCurrencies() external view returns (string[] memory) {
        return supportedCurrencies;
    }
    
    function getTotalTVL() external view returns (uint256) {
        uint256 total;
        for (uint256 i = 0; i < supportedCurrencies.length; i++) {
            total += totalDeposits[supportedCurrencies[i]];
        }
        return total;
    }
}
