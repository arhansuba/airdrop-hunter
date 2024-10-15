const mongoose = require('mongoose');

const AirdropSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  totalAllocation: {
    type: Number,
    required: true
  },
  perUserAllocation: {
    type: Number,
    required: true
  },
  registrationDeadline: {
    type: Date,
    required: true
  },
  distributionDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  contractAddress: {
    type: String,
    required: true
  },
  chainId: {
    type: Number,
    required: true
  },
  tokenAddress: {
    type: String,
    required: true
  },
  tokenSymbol: {
    type: String,
    required: true
  },
  registeredUsers: {
    type: Number,
    default: 0
  },
  eligibilityCriteria: {
    type: String
  },
  projectWebsite: {
    type: String
  },
  socialMediaLinks: {
    twitter: String,
    telegram: String,
    discord: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

AirdropSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Airdrop = mongoose.model('Airdrop', AirdropSchema);

module.exports = Airdrop;