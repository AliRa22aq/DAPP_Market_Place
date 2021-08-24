require('babel-register');
require('babel-polyfill');

module.exports = {
    networks: {
      development: {
        host: "localhost",
        port: 7545,
        network_id: "*"
      }
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      version: "^0.8.0",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
