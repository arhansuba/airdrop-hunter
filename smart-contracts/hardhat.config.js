require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.20", // Match OpenZeppelin version
      },
      {
        version: "0.8.0", // Match your contract version
      }
    ]
  },
};
