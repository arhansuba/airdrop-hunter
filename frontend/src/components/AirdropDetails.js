import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, CircularProgress } from '@material-ui/core';
import { registerForAirdrop, analyzeAirdrop } from '../services/api';

const AirdropDetails = ({ airdrop, walletAddress }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [registered, setRegistered] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleRegister = async () => {
    try {
      setLoading(true);
      await registerForAirdrop(airdrop._id, walletAddress);
      setRegistered(true);
      setError(null);
    } catch (err) {
      setError('Failed to register for airdrop. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    try {
      setLoading(true);
      const analysisData = await analyzeAirdrop(airdrop._id);
      setAnalysis(analysisData);
      setError(null);
    } catch (err) {
      setError('Failed to analyze airdrop. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2">
          {airdrop.name}
        </Typography>
        <Typography color="textSecondary">
          Token: {airdrop.tokenSymbol}
        </Typography>
        <Typography variant="body2" component="p">
          Total Allocation: {airdrop.totalAllocation} {airdrop.tokenSymbol}
        </Typography>
        <Typography variant="body2" component="p">
          Per User Allocation: {airdrop.perUserAllocation} {airdrop.tokenSymbol}
        </Typography>
        <Typography variant="body2" component="p">
          Registration Deadline: {new Date(airdrop.registrationDeadline).toLocaleString()}
        </Typography>
        <Typography variant="body2" component="p">
          Distribution Date: {new Date(airdrop.distributionDate).toLocaleString()}
        </Typography>
        <Typography variant="body2" component="p">
          Registered Users: {airdrop.registeredUsers}
        </Typography>
        
        {walletAddress && !registered && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Register for Airdrop'}
          </Button>
        )}
        
        {registered && (
          <Typography variant="body1" color="primary">
            You are registered for this airdrop!
          </Typography>
        )}
        
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleAnalyze}
          disabled={loading}
          style={{ marginTop: '10px' }}
        >
          {loading ? <CircularProgress size={24} /> : 'Analyze Airdrop'}
        </Button>
        
        {analysis && (
          <div>
            <Typography variant="h6">AI Analysis</Typography>
            <Typography variant="body2">{analysis.summary}</Typography>
            <Typography variant="body2">Recommendation: {analysis.recommendation}</Typography>
          </div>
        )}
        
        {error && (
          <Typography color="error">{error}</Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default AirdropDetails;