import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, ListItemSecondaryAction, Button, CircularProgress } from '@material-ui/core';
import { getAirdrops } from '../services/api';

const AirdropList = ({ onSelectAirdrop }) => {
  const [airdrops, setAirdrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAirdrops();
  }, []);

  const fetchAirdrops = async () => {
    try {
      setLoading(true);
      const data = await getAirdrops();
      setAirdrops(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch airdrops. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <div>{error}</div>;

  return (
    <List>
      {airdrops.map((airdrop) => (
        <ListItem key={airdrop._id}>
          <ListItemText
            primary={airdrop.name}
            secondary={`Total Allocation: ${airdrop.totalAllocation} ${airdrop.tokenSymbol}`}
          />
          <ListItemSecondaryAction>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => onSelectAirdrop(airdrop)}
            >
              View Details
            </Button>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};

export default AirdropList;