const express = require('express');
const router = express.Router();
const airdropController = require('../controllers/airdropController');

// CRUD operations
router.post('/airdrops', airdropController.createAirdrop);
router.get('/airdrops', airdropController.getAllAirdrops);
router.get('/airdrops/:id', airdropController.getAirdropById);
router.put('/airdrops/:id', airdropController.updateAirdrop);
router.delete('/airdrops/:id', airdropController.deleteAirdrop);

// Blockchain interactions
router.post('/airdrops/register', airdropController.registerForAirdrop);
router.get('/airdrops/blockchain/:contractAddress/:airdropId', airdropController.getAirdropFromBlockchain);

// AI-powered features
router.post('/airdrops/strategy', airdropController.getPersonalizedAirdropStrategy);
router.get('/airdrops/:id/analyze', airdropController.analyzeAirdrop);

module.exports = router;