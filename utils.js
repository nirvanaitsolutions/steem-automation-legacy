const Client = require('lightrpc');
const bluebird = require('bluebird');
const steem = require('steem');
const client = new Client('https://api.steemit.com');
steem.api.setOptions({  });
bluebird.promisifyAll(client);

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const sendGMBLR = (to,amount) => {
  const wif = process.env.PRIVATEKEY ||'Private_Key';
  const json = {
    "contractName":"tokens",
    "contractAction":"transfer",
    "contractPayload":
      {"symbol":"GMBLR",
      "to":to,
      "quantity":amount,
      "memo":"You have recieved your Gamblr reward"
    }
  }
  steem.broadcast.customJson(wif, 'anlptl', [], 'ssc-mainnet', json, function(err, result) {
  console.log(err, result);
});
}
const sendPayout = (to,amount,coin) => {
  const wif = process.env.PRIVATEKEY ||'Private_Key';
  const data = {
    "from":"anlptl",
    "to":to,
    "amount":amount+coin,
    "memo":"You have recieved your Gamblr Payout"    
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
const rollDice = (rollPrediction,txnId,Blocknum) => {
  let rollResult = 51;
  return rollResult;
}

module.exports = {
  sleep,
  getBlock,
  sendGMBLR,
  rollDice,
  sendPayout,
  getOpsInBlock,
  getGlobalProps,
  mutliOpsInBlock,
  getBlockOps,
};
