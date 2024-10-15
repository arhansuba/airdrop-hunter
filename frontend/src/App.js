import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Container, Typography, Box } from '@material-ui/core';
import AirdropList from './components/AirdropList';
import AirdropDetails from './components/AirdropDetails';
import WalletConnect from './components/WalletConnect';
import telegramService from './services/telegramService';
import web3Service from './services/web3Service';

const theme = createTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#1c89ff',
    },
    secondary: {
      main: '#ff6b6b',
    },
  },
});

function App() {
  const [selectedAirdrop, setSelectedAirdrop] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    telegramService.init();
    const userInfo = telegramService.getUserInfo();
    setUserInfo(userInfo);
  }, []);

  const handleWalletConnect = async () => {
    const address = await web3Service.connect();
    if (address) {
      setWalletAddress(address);
    }
  };

  const handleSelectAirdrop = (airdrop) => {
    setSelectedAirdrop(airdrop);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm">
        <Box my={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            Airdrop Hunter
          </Typography>
          {userInfo && (
            <Typography variant="subtitle1" gutterBottom>
              Welcome, {userInfo.firstName}!
            </Typography>
          )}
          <WalletConnect onConnect={handleWalletConnect} address={walletAddress} />
          <Box my={2}>
            <AirdropList onSelectAirdrop={handleSelectAirdrop} />
          </Box>
          {selectedAirdrop && (
            <AirdropDetails airdrop={selectedAirdrop} walletAddress={walletAddress} />
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;