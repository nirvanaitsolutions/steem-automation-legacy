const Client = require('lightrpc');
const bluebird = require('bluebird');
const steem = require('steem');
const client = new Client('https://api.steemit.com');
steem.api.setOptions({  });
bluebird.promisifyAll(client);
const bot_account ="Bot Steem username"
const bot_active_key = "Bot's Active private key"
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const sendEngineTokens = (to,amount,token) => {
  const wif = process.env.PRIVATEKEY ||bot_active_key;
  const json = {
    "contractName":"tokens",
    "contractAction":"transfer",
    "contractPayload":
      {"symbol":token,
      "to":to,
      "quantity":amount,
      "memo":"You have recieved your Steem Engine Tokens"
    }
  }
  steem.broadcast.customJson(wif, bot_account, [], 'ssc-mainnet', json, function(err, result) {
  console.log(err, result);
});
}
const broadcastTransfer = (to,amount,coin) => {
  const wif = process.env.PRIVATEKEY ||'Private_Key';
  const data = {
    "from":bot_account,
    "to":to,
    "amount":amount+coin,
    "memo":"You have recieved your Steem sent by "+bot_account    
  }
  steem.broadcast.transfer(data, wif, function(err, result) {
  console.log(err, result);
});
}
const getBlock = blockNum => client.sendAsync({ method: 'get_block', params: [blockNum] }, null);

const getOpsInBlock = (blockNum, onlyVirtual = false) =>
  client.sendAsync({ method: 'get_ops_in_block', params: [blockNum, onlyVirtual] }, null);

const getGlobalProps = () =>
  client.sendAsync({ method: 'get_dynamic_global_properties', params: [] }, null);

const mutliOpsInBlock = (start, limit, onlyVirtual = false) => {
  const request = [];
  for (let i = start; i < start + limit; i++) {
    request.push({ method: 'get_ops_in_block', params: [i, onlyVirtual] });
  }
  return client.sendBatchAsync(request, { timeout: 20000 });
};

const getBlockOps = block => {
  const operations = [];
  block.transactions.forEach(transaction => {
    operations.push(...transaction.operations);
  });
  return operations;
};


module.exports = {
  sleep,
  getBlock,
  sendGMBLR,
  rollDice,
  broadcastTransfer,
  getOpsInBlock,
  getGlobalProps,
  mutliOpsInBlock,
  getBlockOps,
};
