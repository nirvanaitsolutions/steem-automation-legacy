const _ = require('lodash');
const express = require('express');
const sdk = require('sc2-sdk');
const bodyParser = require('body-parser');
const redis = require('./redis')
const utils = require('./utils');
const sc2 = sdk.Initialize({ app: 'steemlinked.app' });
var cors = require('cors');
const app = express();
app.use(cors());
app.use(bodyParser.json());
const port = process.env.PORT || 4000;
const server = app.listen(port, () => console.log(`Listening on ${port}`));
  
/** Stream the blockchain for Transactions */

 const getTransactions = ops => {
   ops.forEach(op => {
     const type = op.op[0];
     const params = op.op[1];
     switch (type) {
       case 'transfer': {
         /** Find transfer */
         const transaction = {
           type: 'transfer',
           from: params.from,
           amount: params.amount,
           memo: params.memo,
           timestamp: Date.parse(op.timestamp) / 1000,
           block: op.block,
         };
          
         //send freex if to is freedomex
         if(params.to==='anlptl'){
            console.log('Transfer', JSON.stringify(transaction));
             utils.sendFreeX(params.from,params.amount);
             console.log("sweets sent!")
         }
         break;
         /** Add Cases for all transactionTYPES */
       }
     }
   });
   return;
 };

 const loadBlock = blockNum => {
   utils
     .getOpsInBlock(blockNum, false)
     .then(ops => {
       if (!ops.length) {
         console.error('Block does not exit?', blockNum);
         utils
           .getBlock(blockNum)
           .then(block => {
             if (block && block.previous && block.transactions.length === 0) {
               console.log('Block exist and is empty, load next', blockNum);
               redis
                 .setAsync('last_block_num', blockNum)
                 .then(() => {
                     console.log("block loaded "+blockNum)
                   loadNextBlock();
                 })
                 .catch(err => {
                   console.error('Redis set last_block_num failed', err);
                   loadBlock(blockNum);
                 });
             } else {
               console.log('Sleep and retry', blockNum);
               utils.sleep(2000).then(() => {
                 loadBlock(blockNum);
               });
             }
           })
           .catch(err => {
             console.log(
               'Error lightrpc (getBlock), sleep and retry',
               blockNum,
               JSON.stringify(err),
             );
             utils.sleep(2000).then(() => {
               loadBlock(blockNum);
             });
           });
       } else {
         getTransactions(ops);
         loadNextBlock()}
           })
           .catch(err => {
             console.error('Gettxn failed', err);
             loadBlock(blockNum);
           })
     .catch(err => {
       console.error('Call failed with lightrpc (getOpsInBlock)', err);
       console.log('Retry', blockNum);
       loadBlock(blockNum);
     });
 };

 const loadNextBlock = () => {
   redis
     .getAsync('last_block_num')
     .then(res => {
         console.log("retrieved from redis "+res)
       let nextBlockNum = res === null ? 30454670  : parseInt(res) + 1;
       //let nextBlockNum =  304522970  ;// testing purpose
       utils
         .getGlobalProps()
         .then(globalProps => {
           const lastIrreversibleBlockNum = globalProps.last_irreversible_block_num;
           if (lastIrreversibleBlockNum >= nextBlockNum) {
             loadBlock(nextBlockNum);
             console.log("now processing block no : "+nextBlockNum)
           } else {
             utils.sleep(2000).then(() => {
               console.log(
                 'Waiting to be on the lastIrreversibleBlockNum',
                 lastIrreversibleBlockNum,
                 'now nextBlockNum',
                 nextBlockNum,
               );
               loadNextBlock();
             });
           }
         })
         .catch(err => {
           console.error('Call failed with lightrpc (getGlobalProps)', err);
           utils.sleep(2000).then(() => {
             console.log('Retry loadNextBlock', nextBlockNum);
             loadNextBlock();
           });
         });
     })
     .catch(err => {
       console.error('Redis get last_block_num failed', err);
     });
 };

 const start = () => {
   console.info('Start streaming blockchain');
   loadNextBlock();
 };
 
 start();
