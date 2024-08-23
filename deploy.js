const HDWalletProvider = require('@truffle/hdwallet-provider');
const { Web3 } = require('web3');
 
// const { abi, evm } = require('./compile');
const compiledFactory = require('./build/CampaignFactory.json');
 
provider = new HDWalletProvider(
  'need pulse joy plate input comic debate real flag taxi awkward kingdom',
    'https://sepolia.infura.io/v3/3ff51a3ae5ad4776a15a55d6f2a2c4aa'
);
 
const web3 = new Web3(provider);
 
const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
 
  console.log('Attempting to deploy from account', accounts[0]);
 
  const result = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object})
    .send({ from: accounts[0] });
 
  console.log('Contract deployed to', result.options.address);
  provider.engine.stop();
};
console.log(compiledFactory.abi);

deploy();

// 0x6a8d96bb22472b8c677a54dE07380540d491AF79  address where contract is deployed