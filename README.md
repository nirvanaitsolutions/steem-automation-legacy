# What is steem-automation ?
Steem Automation is a node.js based bot application to stream the steem blockchain for new blocks,
parse them for ttransactions and do custom operations when a transaction meets a predefine criteria. 

# How does it work ?
Steem automation uses steemjs for querying blocks, dsteem.js for broadcasting transactions and a centralised MongoDB
database to store the last processed block number,although it can be replaced by another database easily. Please note that
this script does not store the actual blocks anywhere, just processes them one by one,
but it can be modified to store blocks/transactions on the centralsied database too.

# How to run the bot ?
### Requirements 
- Node.js v8+ 
- MOngoDB (local or mlab)

### Setup
- Clone the repo locally
```bash
git clone https://github.com/nirvanaitsolutions/steem-automation
```
- Install dependencies 
``` npm install
```
- Configure the environment variables
Add the bot account name and active key in utils.js and mongodb url in mongo_util.js

# Examples 
See the ```examples``` directory for examples

# Use Cases 
- Automate Upvote
- Automate Resteem 
- Automate Bets on steem/steem-engine based betting sites
- Automate Dice Payouts on your dice app

You can tell us more :D

# Roadmap 
- Add environment variables via .env files
- Add procfile for heroku deployment
- Add predefined rules
- Add a front end to set rules and environment variables
- Add support for SCOT operations

# How to contribute
- Fork the Repo
- Create a new branch named as issue number
- Commit your code 
- Raise a Pull Request
