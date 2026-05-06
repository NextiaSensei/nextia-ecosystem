// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Staking is Ownable {
    struct StakingInfo {
        uint256 amount;
        uint256 startTime;
        uint256 lastRewardTime;
        uint256 rewards;
    }

    IERC20 public nxtToken;
    uint256 public rewardRatePerSecond;
    uint256 public totalStaked;
    
    mapping(address => StakingInfo) public stakingInfo;

    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount);

    constructor(address _nxtTokenAddress, address _initialOwner)
        Ownable(_initialOwner)
    {
        require(_nxtTokenAddress != address(0), "Invalid token");
        nxtToken = IERC20(_nxtTokenAddress);
        rewardRatePerSecond = 6340000000000000;
    }

    function deposit(uint256 amount) external {
        require(amount > 0, "Amount > 0");
        require(nxtToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        if (stakingInfo[msg.sender].amount > 0) {
            _calculateRewards(msg.sender);
        }

        stakingInfo[msg.sender].amount += amount;
        stakingInfo[msg.sender].startTime = block.timestamp;
        stakingInfo[msg.sender].lastRewardTime = block.timestamp;
        totalStaked += amount;

        emit Deposited(msg.sender, amount);
    }

    function withdraw(uint256 amount) external {
        require(amount > 0, "Amount > 0");
        require(stakingInfo[msg.sender].amount >= amount, "Insufficient");

        _calculateRewards(msg.sender);
        stakingInfo[msg.sender].amount -= amount;
        totalStaked -= amount;

        require(nxtToken.transfer(msg.sender, amount), "Transfer failed");
        emit Withdrawn(msg.sender, amount);
    }

    function claimRewards() external {
        _calculateRewards(msg.sender);
        uint256 rewards = stakingInfo[msg.sender].rewards;
        require(rewards > 0, "No rewards");

        stakingInfo[msg.sender].rewards = 0;
        stakingInfo[msg.sender].lastRewardTime = block.timestamp;

        require(nxtToken.transfer(msg.sender, rewards), "Transfer failed");
        emit RewardsClaimed(msg.sender, rewards);
    }

    function withdrawAll() external {
        require(stakingInfo[msg.sender].amount > 0, "Nothing staked");

        uint256 stakedAmount = stakingInfo[msg.sender].amount;
        _calculateRewards(msg.sender);
        uint256 rewards = stakingInfo[msg.sender].rewards;

        stakingInfo[msg.sender].amount = 0;
        stakingInfo[msg.sender].rewards = 0;
        totalStaked -= stakedAmount;

        uint256 totalTransfer = stakedAmount + rewards;
        require(nxtToken.transfer(msg.sender, totalTransfer), "Transfer failed");

        emit Withdrawn(msg.sender, stakedAmount);
        if (rewards > 0) {
            emit RewardsClaimed(msg.sender, rewards);
        }
    }

    function _calculateRewards(address user) internal {
        StakingInfo storage info = stakingInfo[user];
        if (info.amount == 0) return;

        uint256 timeElapsed = block.timestamp - info.lastRewardTime;
        if (timeElapsed == 0) return;

        uint256 newRewards = (timeElapsed * info.amount * rewardRatePerSecond) / 1e18;
        info.rewards += newRewards;
        info.lastRewardTime = block.timestamp;
    }

    function getPendingRewards(address user) external view returns (uint256) {
        StakingInfo storage info = stakingInfo[user];
        if (info.amount == 0) return info.rewards;

        uint256 timeElapsed = block.timestamp - info.lastRewardTime;
        uint256 newRewards = (timeElapsed * info.amount * rewardRatePerSecond) / 1e18;
        return info.rewards + newRewards;
    }

    function getStakedAmount(address user) external view returns (uint256) {
        return stakingInfo[user].amount;
    }

    function setRewardRate(uint256 newRate) external onlyOwner {
        rewardRatePerSecond = newRate;
    }
}
