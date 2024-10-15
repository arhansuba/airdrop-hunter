const Airdrop = require('../models/Airdrop');
const { ethers } = require('ethers');
const AirdropTrackerABI = require('../abis/AirdropTracker.json');
const { AI_SERVICE_URL } = process.env;
const axios = require('axios');

// Initialize ethers provider (replace with your provider URL)
const provider = new ethers.providers.JsonRpcProvider(process.env.ETH_PROVIDER_URL);

exports.createAirdrop = async (req, res) => {
  try {
    const newAirdrop = new Airdrop(req.body);
    await newAirdrop.save();
    res.status(201).json(newAirdrop);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllAirdrops = async (req, res) => {
  try {
    const airdrops = await Airdrop.find();
    res.status(200).json(airdrops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAirdropById = async (req, res) => {
  try {
    const airdrop = await Airdrop.findById(req.params.id);
    if (!airdrop) return res.status(404).json({ message: 'Airdrop not found' });
    res.status(200).json(airdrop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAirdrop = async (req, res) => {
  try {
    const updatedAirdrop = await Airdrop.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedAirdrop) return res.status(404).json({ message: 'Airdrop not found' });
    res.status(200).json(updatedAirdrop);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteAirdrop = async (req, res) => {
  try {
    const deletedAirdrop = await Airdrop.findByIdAndDelete(req.params.id);
    if (!deletedAirdrop) return res.status(404).json({ message: 'Airdrop not found' });
    res.status(200).json({ message: 'Airdrop deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.registerForAirdrop = async (req, res) => {
  try {
    const { airdropId, userAddress } = req.body;
    const airdrop = await Airdrop.findById(airdropId);
    if (!airdrop) return res.status(404).json({ message: 'Airdrop not found' });

    // Interact with the smart contract
    const contract = new ethers.Contract(airdrop.contractAddress, AirdropTrackerABI, provider);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const contractWithSigner = contract.connect(signer);

    const tx = await contractWithSigner.registerForAirdrop(airdrop.contractAirdropId, userAddress);
    await tx.wait();

    // Update the airdrop in the database
    airdrop.registeredUsers += 1;
    await airdrop.save();

    res.status(200).json({ message: 'Successfully registered for airdrop', transactionHash: tx.hash });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAirdropFromBlockchain = async (req, res) => {
  try {
    const { contractAddress, airdropId } = req.params;
    const contract = new ethers.Contract(contractAddress, AirdropTrackerABI, provider);
    const airdropInfo = await contract.getAirdropInfo(airdropId);

    const formattedAirdrop = {
      name: airdropInfo.name,
      totalAllocation: ethers.utils.formatEther(airdropInfo.totalAllocation),
      perUserAllocation: ethers.utils.formatEther(airdropInfo.perUserAllocation),
      registrationDeadline: new Date(airdropInfo.registrationDeadline.toNumber() * 1000),
      distributionDate: new Date(airdropInfo.distributionDate.toNumber() * 1000),
      isActive: airdropInfo.isActive,
      registeredCount: airdropInfo.registeredCount.toNumber()
    };

    res.status(200).json(formattedAirdrop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPersonalizedAirdropStrategy = async (req, res) => {
  try {
    const { userPreferences } = req.body;
    const airdrops = await Airdrop.find({ isActive: true });

    // Call the AI service to get personalized strategy
    const aiResponse = await axios.post(`${AI_SERVICE_URL}/generate-strategy`, {
      userPreferences,
      airdrops
    });

    res.status(200).json(aiResponse.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.analyzeAirdrop = async (req, res) => {
  try {
    const { airdropId } = req.params;
    const airdrop = await Airdrop.findById(airdropId);
    if (!airdrop) return res.status(404).json({ message: 'Airdrop not found' });

    // Call the AI service to analyze the airdrop
    const aiResponse = await axios.post(`${AI_SERVICE_URL}/analyze-airdrop`, {
      airdrop
    });

    res.status(200).json(aiResponse.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};