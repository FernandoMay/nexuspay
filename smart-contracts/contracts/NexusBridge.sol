// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./NexusToken.sol";

/**
 * @title NexusBridge
 * @dev Cross-currency swap and bridge contract for Nexus Pay
 * Handles tokenized currency swaps with yield generation
 */
contract NexusBridge is ReentrancyGuard, Ownable {
    
    // Token registry
    mapping(string => address) public currencyTokens; // "MXN" => NexusToken address
    mapping(address => string) public tokenCurrencies; // NexusToken address => "MXN"
    
    // Exchange rates (set by oracle in production)
    mapping(string => mapping(string => uint256)) public exchangeRates; // fromCurrency => toCurrency => rate (scaled by 1e8)
    
    // Fee structure
    uint256 public protocolFee = 50; // 0.5% (in basis points)
    uint256 public constant FEE_DENOMINATOR = 10000;
    
    // Yield pool
    uint256 public yieldPoolBalance;
    uint256 public yieldAPY = 400; // 4% APY (in basis points)
    
    // Events
    event SwapExecuted(
        address indexed user,
        string fromCurrency,
        string toCurrency,
        uint256 fromAmount,
        uint256 toAmount,
        uint256 fee,
        uint256 yield
    );
    
    event TokenRegistered(string currency, address tokenAddress);
    event ExchangeRateUpdated(string fromCurrency, string toCurrency, uint256 rate);
    event YieldDistributed(address indexed user, uint256 amount);
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev Register a new tokenized currency
     */
    function registerToken(
        string memory currencyCode,
        address tokenAddress
    ) external onlyOwner {
        require(currencyTokens[currencyCode] == address(0), "Currency already registered");
        require(tokenAddress != address(0), "Invalid token address");
        
        currencyTokens[currencyCode] = tokenAddress;
        tokenCurrencies[tokenAddress] = currencyCode;
        
        emit TokenRegistered(currencyCode, tokenAddress);
    }
    
    /**
     * @dev Update exchange rate (oracle in production)
     */
    function setExchangeRate(
        string memory fromCurrency,
        string memory toCurrency,
        uint256 rate
    ) external onlyOwner {
        require(currencyTokens[fromCurrency] != address(0), "From currency not registered");
        require(currencyTokens[toCurrency] != address(0), "To currency not registered");
        
        exchangeRates[fromCurrency][toCurrency] = rate;
        emit ExchangeRateUpdated(fromCurrency, toCurrency, rate);
    }
    
    /**
     * @dev Execute a cross-currency swap
     */
    function swap(
        string memory fromCurrency,
        string memory toCurrency,
        uint256 amount
    ) external nonReentrant returns (uint256 toAmount, uint256 yieldEarned) {
        require(currencyTokens[fromCurrency] != address(0), "From currency not supported");
        require(currencyTokens[toCurrency] != address(0), "To currency not supported");
        require(amount > 0, "Amount must be greater than 0");
        
        address fromToken = currencyTokens[fromCurrency];
        address toToken = currencyTokens[toCurrency];
        
        // Transfer tokens from user
        IERC20(fromToken).transferFrom(msg.sender, address(this), amount);
        
        // Calculate amounts
        uint256 rate = exchangeRates[fromCurrency][toCurrency];
        require(rate > 0, "Exchange rate not set");
        
        uint256 fee = (amount * protocolFee) / FEE_DENOMINATOR;
        uint256 netAmount = amount - fee;
        
        // Calculate converted amount (rate is scaled by 1e8)
        toAmount = (netAmount * rate) / 1e8;
        
        // Calculate yield (simplified - based on transfer time)
        yieldEarned = calculateYield(netAmount);
        
        // Mint/transfer output tokens
        NexusToken(toToken).mint(msg.sender, toAmount + yieldEarned);
        
        // Distribute yield from pool
        if (yieldEarned > 0 && yieldPoolBalance >= yieldEarned) {
            yieldPoolBalance -= yieldEarned;
            emit YieldDistributed(msg.sender, yieldEarned);
        }
        
        emit SwapExecuted(
            msg.sender,
            fromCurrency,
            toCurrency,
            amount,
            toAmount,
            fee,
            yieldEarned
        );
        
        return (toAmount, yieldEarned);
    }
    
    /**
     * @dev Calculate yield based on amount and APY
     */
    function calculateYield(uint256 amount) public view returns (uint256) {
        uint256 secondsPerYear = 31536000;
        uint256 transferSeconds = 3;
        return (amount * yieldAPY * transferSeconds) / (FEE_DENOMINATOR * secondsPerYear);
    }
    
    /**
     * @dev Add funds to yield pool
     */
    function addToYieldPool(uint256 amount) external {
        yieldPoolBalance += amount;
    }
    
    /**
     * @dev Update protocol fee
     */
    function setProtocolFee(uint256 newFee) external onlyOwner {
        require(newFee <= 500, "Fee cannot exceed 5%");
        protocolFee = newFee;
    }
    
    /**
     * @dev Update yield APY
     */
    function setYieldAPY(uint256 newAPY) external onlyOwner {
        require(newAPY <= 2000, "APY cannot exceed 20%");
        yieldAPY = newAPY;
    }
    
    /**
     * @dev Get exchange rate
     */
    function getRate(string memory fromCurrency, string memory toCurrency) external view returns (uint256) {
        return exchangeRates[fromCurrency][toCurrency];
    }
}
