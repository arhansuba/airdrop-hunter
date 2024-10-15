const axios = require('axios');
const { AI_SERVICE_URL } = process.env;

class AIService {
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: AI_SERVICE_URL,
      timeout: 30000, // 30 seconds timeout
    });
  }

  async generateStrategy(userPreferences, marketData) {
    try {
      const response = await this.axiosInstance.post('/generate-strategy', {
        user_preferences: userPreferences,
        market_data: marketData,
      });
      return response.data;
    } catch (error) {
      console.error('Error generating strategy:', error);
      throw new Error('Failed to generate airdrop strategy');
    }
  }

  async analyzeAirdrop(airdropData) {
    try {
      const response = await this.axiosInstance.post('/analyze-airdrop', {
        airdrop_data: airdropData,
      });
      return response.data;
    } catch (error) {
      console.error('Error analyzing airdrop:', error);
      throw new Error('Failed to analyze airdrop');
    }
  }

  async filterAirdrops(airdrops, userPreferences) {
    try {
      const response = await this.axiosInstance.post('/filter-airdrops', {
        airdrops: airdrops,
        user_preferences: userPreferences,
      });
      return response.data;
    } catch (error) {
      console.error('Error filtering airdrops:', error);
      throw new Error('Failed to filter airdrops');
    }
  }

  async getMarketData() {
    try {
      const response = await this.axiosInstance.get('/market-data');
      return response.data;
    } catch (error) {
      console.error('Error fetching market data:', error);
      throw new Error('Failed to fetch market data');
    }
  }
}

module.exports = new AIService();