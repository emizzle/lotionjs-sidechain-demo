const lotion = require('lotion');
const path = require('path');
const { inspect } = require('util');
const fs = require('fs');

const networkConfigPath = "./network/config";

async function go() {
  const config = {
    initialState: {
      count: 0,
      accounts: [
        //key = address: "0x8756093D8D841CcAa4e3aDacE3266E00d48D05d5", value = balance: "100000"
      ]
    }
  };

  let app = lotion(config);

  app.use(function (state, tx) {
    if (state.count !== tx.nonce) return;

    if (state.count === tx.nonce) {
      state.count++;
    }
    switch (tx.method) {
      case "seed":
        const { account, balance } = tx.payload;
        if (!account) return console.error(`Seed error: no 'account' specified`);
        if (!balance) return console.error(`Seed error: no 'balance' specified`);
        if (!state.accounts[account]) {
          state.accounts[account] = balance;
        }
        break;
      case "sendTransaction":
        console.log(`Received 'sendTransaction' with payload ${JSON.stringify(tx.payload)}`);
        const { from, to, value } = tx.payload;
        if (!from) return console.error(`Send transaction error: no 'from' account specified`);
        if (!to) return console.error(`Send transaction error: no 'to' account specified`);
        if (!value) return console.error(`Send transaction error: no 'value' specified`);
        const fromValue = state.accounts[from];
        if (fromValue < value) return; // insufficient funds
        state.accounts[from] -= value;

        const toValue = (state.accounts[to] || 0);
        state.accounts[to] = toValue + value;
        break;
    }
  });
  console.log("Starting network...");
  const appInfo = await app.start();
  console.log(inspect(appInfo));
  fs.writeFile("network/config/config.json", JSON.stringify(appInfo), (err) => {
    if (err) return console.error(err);
    console.log("Config updated");
  });
}
go();