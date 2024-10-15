// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract AirdropTracker is Ownable, Pausable, ReentrancyGuard {
    struct Airdrop {
        string name;
        uint256 totalAllocation;
        uint256 perUserAllocation;
        uint256 registrationDeadline;
        uint256 distributionDate;
        bool isActive;
        uint256 registeredCount;
    }

    mapping(uint256 => Airdrop) public airdrops;
    mapping(uint256 => mapping(address => bool)) public registeredUsers;

    uint256 public airdropCount;

    event AirdropCreated(uint256 indexed id, string name, uint256 totalAllocation, uint256 perUserAllocation, uint256 registrationDeadline, uint256 distributionDate);
    event UserRegistered(uint256 indexed airdropId, address indexed user);
    event AirdropPaused(uint256 indexed airdropId);
    event AirdropResumed(uint256 indexed airdropId);
    event FundsWithdrawn(uint256 amount);

    // Pass the owner (msg.sender) to the Ownable constructor
    constructor() Ownable(msg.sender) {
        airdropCount = 0;
    }

    function createAirdrop(
        string memory _name,
        uint256 _totalAllocation,
        uint256 _perUserAllocation,
        uint256 _registrationDeadline,
        uint256 _distributionDate
    ) external onlyOwner {
        require(_registrationDeadline > block.timestamp, "Registration deadline must be in the future");
        require(_distributionDate > _registrationDeadline, "Distribution date must be after registration deadline");
        require(_totalAllocation > 0 && _perUserAllocation > 0, "Allocations must be greater than 0");

        airdropCount++;
        Airdrop storage newAirdrop = airdrops[airdropCount];
        newAirdrop.name = _name;
        newAirdrop.totalAllocation = _totalAllocation;
        newAirdrop.perUserAllocation = _perUserAllocation;
        newAirdrop.registrationDeadline = _registrationDeadline;
        newAirdrop.distributionDate = _distributionDate;
        newAirdrop.isActive = true;

        emit AirdropCreated(airdropCount, _name, _totalAllocation, _perUserAllocation, _registrationDeadline, _distributionDate);
    }

    function registerForAirdrop(uint256 _airdropId) external whenNotPaused nonReentrant {
        require(_airdropId <= airdropCount && _airdropId > 0, "Invalid airdrop ID");
        Airdrop storage airdrop = airdrops[_airdropId];
        require(airdrop.isActive, "Airdrop is not active");
        require(block.timestamp <= airdrop.registrationDeadline, "Registration period has ended");
        require(!registeredUsers[_airdropId][msg.sender], "Already registered for this airdrop");
        require(airdrop.registeredCount * airdrop.perUserAllocation <= airdrop.totalAllocation, "Airdrop is full");

        registeredUsers[_airdropId][msg.sender] = true;
        airdrop.registeredCount++;

        emit UserRegistered(_airdropId, msg.sender);
    }

    function isUserRegistered(uint256 _airdropId, address _user) external view returns (bool) {
        require(_airdropId <= airdropCount && _airdropId > 0, "Invalid airdrop ID");
        return registeredUsers[_airdropId][_user];
    }

    function getAirdropInfo(uint256 _airdropId) external view returns (
        string memory name,
        uint256 totalAllocation,
        uint256 perUserAllocation,
        uint256 registrationDeadline,
        uint256 distributionDate,
        bool isActive,
        uint256 registeredCount
    ) {
        require(_airdropId <= airdropCount && _airdropId > 0, "Invalid airdrop ID");
        Airdrop storage airdrop = airdrops[_airdropId];
        return (
            airdrop.name,
            airdrop.totalAllocation,
            airdrop.perUserAllocation,
            airdrop.registrationDeadline,
            airdrop.distributionDate,
            airdrop.isActive,
            airdrop.registeredCount
        );
    }

    function pauseAirdrop(uint256 _airdropId) external onlyOwner {
        require(_airdropId <= airdropCount && _airdropId > 0, "Invalid airdrop ID");
        Airdrop storage airdrop = airdrops[_airdropId];
        require(airdrop.isActive, "Airdrop is already paused");
        airdrop.isActive = false;
        emit AirdropPaused(_airdropId);
    }

    function resumeAirdrop(uint256 _airdropId) external onlyOwner {
        require(_airdropId <= airdropCount && _airdropId > 0, "Invalid airdrop ID");
        Airdrop storage airdrop = airdrops[_airdropId];
        require(!airdrop.isActive, "Airdrop is already active");
        airdrop.isActive = true;
        emit AirdropResumed(_airdropId);
    }

    function withdrawFunds() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        (bool success, ) = owner().call{value: balance}("");
        require(success, "Withdrawal failed");
        emit FundsWithdrawn(balance);
    }

    receive() external payable {}
}
