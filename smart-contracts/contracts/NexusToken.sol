// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "@hedera/smart-contracts/contracts/HederaTokenService.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title NexusToken
 * @dev Tokenized currency representation on Hedera
 * Each token represents a fiat currency (MXN.x, PEN.x, USD.x, etc.)
 */
contract NexusToken is HederaTokenService, IERC20, Ownable {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;
    
    address public tokenAddress;
    
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;
    
    // Currency backing info
    string public currencyCode; // MXN, PEN, USD, etc.
    uint256 public backingRatio; // 100 = 1:1, 105 = 5% overcollateralized
    
    event Minted(address indexed to, uint256 amount);
    event Burned(address indexed from, uint256 amount);
    event BackingUpdated(uint256 newRatio);
    
    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        string memory _currencyCode,
        address _tokenAddress
    ) Ownable(msg.sender) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        currencyCode = _currencyCode;
        backingRatio = 100;
        tokenAddress = _tokenAddress;
    }
    
    function balanceOf(address account) public view override returns (uint256) {
        return _balances[account];
    }
    
    function transfer(address to, uint256 amount) public override returns (bool) {
        _transfer(msg.sender, to, amount);
        return true;
    }
    
    function allowance(address owner, address spender) public view override returns (uint256) {
        return _allowances[owner][spender];
    }
    
    function approve(address spender, uint256 amount) public override returns (bool) {
        _approve(msg.sender, spender, amount);
        return true;
    }
    
    function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
        uint256 currentAllowance = _allowances[from][msg.sender];
        require(currentAllowance >= amount, "ERC20: transfer amount exceeds allowance");
        _approve(from, msg.sender, currentAllowance - amount);
        _transfer(from, to, amount);
        return true;
    }
    
    function _transfer(address from, address to, uint256 amount) internal {
        require(from != address(0), "ERC20: transfer from zero address");
        require(to != address(0), "ERC20: transfer to zero address");
        require(_balances[from] >= amount, "ERC20: transfer amount exceeds balance");
        
        _balances[from] -= amount;
        _balances[to] += amount;
        
        emit Transfer(from, to, amount);
    }
    
    function _approve(address owner, address spender, uint256 amount) internal {
        require(owner != address(0), "ERC20: approve from zero address");
        require(spender != address(0), "ERC20: approve to zero address");
        
        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }
    
    function mint(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "ERC20: mint to zero address");
        
        totalSupply += amount;
        _balances[to] += amount;
        
        emit Minted(to, amount);
        emit Transfer(address(0), to, amount);
    }
    
    function burn(address from, uint256 amount) external onlyOwner {
        require(from != address(0), "ERC20: burn from zero address");
        require(_balances[from] >= amount, "ERC20: burn amount exceeds balance");
        
        _balances[from] -= amount;
        totalSupply -= amount;
        
        emit Burned(from, amount);
        emit Transfer(from, address(0), amount);
    }
    
    function updateBackingRatio(uint256 _newRatio) external onlyOwner {
        require(_newRatio >= 100, "Backing ratio must be at least 100%");
        backingRatio = _newRatio;
        emit BackingUpdated(_newRatio);
    }
}
