import os
import openai
import requests
from dotenv import load_dotenv
from typing import Dict, List

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

class AirdropHunterAI:
    def __init__(self):
        self.system_prompt = """
        You are an AI assistant specialized in identifying and optimizing airdrop opportunities in the cryptocurrency space. 
        Your goal is to provide users with personalized strategies for finding and participating in airdrops based on their preferences and market conditions.
        """

    def generate_strategy(self, user_preferences: Dict, market_data: Dict) -> str:
        prompt = f"""
        Given the following user preferences and market data, provide a personalized airdrop hunting strategy:

        User Preferences:
        {user_preferences}

        Market Data:
        {market_data}

        Please provide a detailed strategy including:
        1. Recommended types of airdrops to focus on
        2. Potential high-value projects to watch
        3. Best practices for increasing chances of qualifying for airdrops
        4. Risk assessment and mitigation strategies
        5. Timeline and action steps for the user to follow
        """

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": self.system_prompt},
                {"role": "user", "content": prompt}
            ],
            max_tokens=1000,
            n=1,
            stop=None,
            temperature=0.7,
        )

        return response.choices[0].message['content'].strip()

    def analyze_airdrop(self, airdrop_data: Dict) -> Dict:
        prompt = f"""
        Analyze the following airdrop opportunity and provide insights:

        Airdrop Data:
        {airdrop_data}

        Please provide:
        1. A brief summary of the project
        2. Potential value and risks of the airdrop
        3. Eligibility requirements and how to qualify
        4. Estimated timeline for the airdrop
        5. Recommendation (Participate/Skip) with a brief explanation
        """

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": self.system_prompt},
                {"role": "user", "content": prompt}
            ],
            max_tokens=500,
            n=1,
            stop=None,
            temperature=0.5,
        )

        analysis = response.choices[0].message['content'].strip()
        
        return {
            "summary": analysis.split("\n\n")[0],
            "analysis": analysis,
            "recommendation": "Participate" if "Recommendation: Participate" in analysis else "Skip"
        }

    def get_market_data(self) -> Dict:
        # This is a placeholder function. In a real-world scenario, you would
        # integrate with cryptocurrency market data APIs to get real-time information.
        return {
            "trending_sectors": ["DeFi", "Layer 2", "NFTs"],
            "upcoming_events": ["Ethereum Shanghai Upgrade", "Polkadot Parachain Auctions"],
            "market_sentiment": "Bullish",
            "top_performing_tokens": ["ETH", "BNB", "SOL"]
        }

    def filter_airdrops(self, airdrops: List[Dict], user_preferences: Dict) -> List[Dict]:
        filtered_airdrops = []
        for airdrop in airdrops:
            analysis = self.analyze_airdrop(airdrop)
            if analysis["recommendation"] == "Participate":
                if user_preferences.get("preferred_sectors") and any(sector in analysis["summary"] for sector in user_preferences["preferred_sectors"]):
                    filtered_airdrops.append({**airdrop, "analysis": analysis})
                elif user_preferences.get("risk_tolerance") == "high" or "low risk" in analysis["analysis"].lower():
                    filtered_airdrops.append({**airdrop, "analysis": analysis})

        return filtered_airdrops

# Example usage
if __name__ == "__main__":
    ai_agent = AirdropHunterAI()
    
    user_preferences = {
        "preferred_sectors": ["DeFi", "NFT"],
        "risk_tolerance": "medium",
        "preferred_chains": ["Ethereum", "Solana"],
        "holding_period": "long-term"
    }

    market_data = ai_agent.get_market_data()

    strategy = ai_agent.generate_strategy(user_preferences, market_data)
    print("Personalized Airdrop Strategy:")
    print(strategy)
    print("\n" + "="*50 + "\n")

    sample_airdrops = [
        {
            "name": "DeFi Yield Aggregator",
            "description": "A new DeFi protocol that optimizes yield farming across multiple platforms.",
            "total_value": "$1,000,000",
            "distribution_method": "Retroactive",
            "eligibility": "Users who have interacted with major DeFi protocols"
        },
        {
            "name": "NFT Marketplace",
            "description": "A new NFT marketplace focusing on music and audio NFTs.",
            "total_value": "$500,000",
            "distribution_method": "Task-based",
            "eligibility": "Users who create an account and list an NFT"
        }
    ]

    filtered_airdrops = ai_agent.filter_airdrops(sample_airdrops, user_preferences)
    print("Filtered Airdrops:")
    for airdrop in filtered_airdrops:
        print(f"Name: {airdrop['name']}")
        print(f"Summary: {airdrop['analysis']['summary']}")
        print(f"Recommendation: {airdrop['analysis']['recommendation']}")
        print("-"*30)