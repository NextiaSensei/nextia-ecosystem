// Direcciones de contratos (Localhost)
export const CONTRACT_ADDRESSES = {
  NEXTIA_TOKEN: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  STAKING: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  REWARDS: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  GOVERNANCE: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
};

// ABI de NextiaToken (ERC20)
export const NEXTIA_TOKEN_ABI = [
  "function balanceOf(address account) public view returns (uint256)",
  "function transfer(address to, uint256 amount) public returns (bool)",
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function allowance(address owner, address spender) public view returns (uint256)",
  "function totalSupply() public view returns (uint256)",
  "function decimals() public view returns (uint8)",
  "function symbol() public view returns (string)",
  "function name() public view returns (string)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
];

// ABI de Staking
export const STAKING_ABI = [
  "function deposit(uint256 amount) external",
  "function withdraw(uint256 amount) external",
  "function withdrawAll() external",
  "function claimRewards() external",
  "function getPendingRewards(address user) external view returns (uint256)",
  "function getStakedAmount(address user) external view returns (uint256)",
  "function setRewardRate(uint256 newRate) external",
  "function totalStaked() public view returns (uint256)",
  "function rewardRatePerSecond() public view returns (uint256)",
  "event Deposited(address indexed user, uint256 amount)",
  "event Withdrawn(address indexed user, uint256 amount)",
  "event RewardsClaimed(address indexed user, uint256 amount)",
];

// ABI de Rewards
export const REWARDS_ABI = [
  "function createRewardPool(uint256 totalRewardAmount, uint256 durationDays) external",
  "function joinRewardPool(uint256 poolId, uint256 amount) external",
  "function claimPoolRewards(uint256 poolId) external",
  "function getPoolInfo(uint256 poolId) external view returns (tuple(uint256 totalRewardAmount, uint256 startTime, uint256 endTime, uint256 totalStaked, bool active))",
  "function getPoolCount() external view returns (uint256)",
  "function getUserRewardInfo(uint256 poolId, address user) external view returns (tuple(uint256 stakedAmount, uint256 rewardsClaimed))",
  "event PoolCreated(uint256 indexed poolId, uint256 totalReward, uint256 endTime)",
  "event UserJoinedPool(uint256 indexed poolId, address indexed user, uint256 amount)",
  "event RewardsDistributed(uint256 indexed poolId, address indexed user, uint256 amount)",
];

// ABI de Governance
export const GOVERNANCE_ABI = [
  "function proposeGovernanceChange(string title) external",
  "function castVote(uint256 proposalId, uint8 support) external",
  "function executeProposal(uint256 proposalId) external",
  "function getProposalInfo(uint256 proposalId) external view returns (tuple(address proposer, string title, uint256 startBlock, uint256 endBlock, uint256 forVotes, uint256 againstVotes, bool executed))",
  "function proposalCount() external view returns (uint256)",
  "function nxtToken() external view returns (address)",
  "event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string title)",
  "event VoteCast(uint256 indexed proposalId, address indexed voter, uint8 support, uint256 votes)",
  "event ProposalExecuted(uint256 indexed proposalId)",
];

// Red Ethereum (Localhost)
export const NETWORKS = {
  LOCALHOST: {
    chainId: 31337,
    name: "Localhost",
    rpcUrl: "http://127.0.0.1:8545",
  },
  SEPOLIA: {
    chainId: 11155111,
    name: "Sepolia Testnet",
    rpcUrl: "https://sepolia.infura.io/v3/YOUR_INFURA_KEY",
  },
};

// Configuración general
export const APP_CONFIG = {
  APP_NAME: "NextiaToken DApp",
  STAKING_APY: 20, // 20%
  MIN_STAKE: "100", // 100 NXT
  GOVERNANCE_MIN_TOKENS: "1000", // 1000 NXT para proponer
};
