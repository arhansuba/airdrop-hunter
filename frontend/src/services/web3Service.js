import { ethers } from 'ethers';
import AirdropTrackerABI from '../abis/AirdropTracker.json';

class Web3Service {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.airdropTrackerContract = null;
  }

  async connect() {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        this.provider = new ethers.providers.Web3Provider(window.ethereum);
        this.signer = this.provider.getSigner();
        return await this.signer.getAddress();
      } catch (error) {
        console.error('User denied account access');
        return null;
      }
    } else {
      console.error('Ethereum object not found, install MetaMask.');
      return null;
    }
  }

  async getNetwork() {
    if (!this.provider) {
      throw new Error('Provider not initialized. Call connect() first.');
    }
    const network = await this.provider.getNetwork();
    return network;
  }

  async getBalance(address) {
    if (!this.provider) {
      throw new Error('Provider not initialized. Call connect() first.');
    }
    const balance = await this.provider.getBalance(address);
    return ethers.utils.formatEther(balance);
  }

  initializeContract(contractAddress) {
    if (!this.signer) {
      throw new Error('Signer not initialized. Call connect() first.');
    }
    this.airdropTrackerContract = new ethers.Contract(
      contractAddress,
      AirdropTrackerABI,
      this.signer
    );
  }

  async createAirdrop(name, totalAllocation, perUserAllocation, registrationDeadline, distributionDate) {
    if (!this.airdropTrackerContract) {
      throw new Error('Contract not initialized. Call initializeContract() first.');
    }
    const tx = await this.airdropTrackerContract.createAirdrop(
      name,
      ethers.utils.parseEther(totalAllocation.toString()),
      ethers.utils.parseEther(perUserAllocation.toString()),
      Math.floor(new Date(registrationDeadline).getTime() / 1000),
      Math.floor(new Date(distributionDate).getTime() / 1000)
    );
    return await tx.wait();
  }

  async registerForAirdrop(airdropId) {
    if (!this.airdropTrackerContract) {
      throw new Error('Contract not initialized. Call initializeContract() first.');
    }
    const tx = await this.airdropTrackerContract.registerForAirdrop(airdropId);
    return await tx.wait();
  }

  async getAirdropInfo(airdropId) {
    if (!this.airdropTrackerContract) {
      throw new Error('Contract not initialized. Call initializeContract() first.');
    }
    const airdropInfo = await this.airdropTrackerContract.getAirdropInfo(airdropId);
    return {
      name: airdropInfo.name,
      totalAllocation: ethers.utils.formatEther(airdropInfo.totalAllocation),
      perUserAllocation: ethers.utils.formatEther(airdropInfo.perUserAllocation),
      registrationDeadline: new Date(airdropInfo.registrationDeadline.toNumber() * 1000),
      distributionDate: new Date(airdropInfo.distributionDate.toNumber() * 1000),
      isActive: airdropInfo.isActive,
      registeredCount: airdropInfo.registeredCount.toNumber()
    };
  }

  async isUserRegistered(airdropId, userAddress) {
    if (!this.airdropTrackerContract) {
      throw new Error('Contract not initialized. Call initializeContract() first.');
    }
    return await this.airdropTrackerContract.isUserRegistered(airdropId, userAddress);
  }
}

export default new Web3Service();