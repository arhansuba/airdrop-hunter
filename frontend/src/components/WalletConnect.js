import React, { useState, useEffect } from 'react';
import { Button, Typography } from '@material-ui/core';
import { WebApp } from '@twa-dev/sdk';

const WalletConnect = ({ onConnect }) => {
  const [address, setAddress] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if the wallet is already connected
    if (WebApp.initDataUnsafe.user && WebApp.initDataUnsafe.user.wallet_address) {
      setAddress(WebApp.initDataUnsafe.user.wallet_address);
      onConnect(WebApp.initDataUnsafe.user.wallet_address);
    }
  }, [onConnect]);

  const handleConnect = async () => {
    try {
      // Request wallet address from Telegram Mini App
      const result = await WebApp.requestWallet();
      if (result) {
        setAddress(result.address);
        onConnect(result.address);
        setError(null);
      } else {
        setError('Failed to connect wallet. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while connecting the wallet.');
      console.error(err);
    }
  };

  return (
    <div>
      {!address ? (
        <Button variant="contained" color="primary" onClick={handleConnect}>
          Connect Wallet
        </Button>
      ) : (
        <Typography variant="body1">
          Connected: {address.slice(0, 6)}...{address.slice(-4)}
        </Typography>
      )}
      {error && <Typography color="error">{error}</Typography>}
    </div>
  );
};

export default WalletConnect;