const Client = require('lightrpc');
const bluebird = require('bluebird');
const steem = require('steem');
const client = new Client('https://api.steemit.com');
steem.api.setOptions({  });
bluebird.promisifyAll(client);

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const sendFreeX = (to,amount) => {
  const wif = process.env.PRIVATEKEY ||'Private_Key';
  const json = {
    "contractName":"tokens",
    "contractAction":"transfer",
    "contractPayload":
      {"symbol":"SWEET",
      "to":to,
      "quantity":amount,
      "memo":"SWEET FOR STEEM"
    }
  }
  steem.broadcast.customJson(wif, 'anlptl', [], 'ssc-mainnet', json, function(err, result) {
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
  sendFreeX,
  getOpsInBlock,
  getGlobalProps,
  mutliOpsInBlock,
  getBlockOps,
};
