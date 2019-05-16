async function main() {
  const { connect } = require('lotion');
  const config = require('./network/config/config.json');

  const account = "0x35827b269f50bE2b000354534DD3583D5bba43Fa";
  const balance = 100000000;
  const otherAccount = "0x8756093D8D841CcAa4e3aDacE3266E00d48D05d5";
  const sendAmount = 100;
  
  let { state, send } = await connect(config.GCI)
  console.log('Connected to node.\n');

  console.log(`Seeding account '${account}' with balance ${balance}...\n`)
  let result = await send({ nonce: await state.count, method: "seed", payload: { account, balance } }); 
  console.log(`${JSON.stringify(result)}\n`);

  console.log("Starting balances:");
  await printAccounts(state);

  console.log(`Sending ${sendAmount} photons to '${otherAccount}'...`);
  result = await send({ nonce: await state.count, method: "sendTransaction", payload: { from: account, to: otherAccount, value: sendAmount } }); 
  console.log(`${JSON.stringify(result)}\n`);

  console.log("Finishing balances:");
  await printAccounts(state);
}

async function printAccounts(state) {
  let output = "";
  let accounts = await state.accounts;
  for (key in accounts) {
    output += `${key}: ${accounts[key]}\n`;
  }
  console.log(`${output}\n`);
}
main()