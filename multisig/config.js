const { Api, JsonRpc } = require(`eosjs`);
const { JsSignatureProvider } = require("eosjs/dist/eosjs-jssig");
const fetch = require(`node-fetch`); // node only; not needed in browsers
const { TextEncoder, TextDecoder } = require(`util`); // node only; native TextEncoder/Decoder

const signatureProvider = new JsSignatureProvider([
  "PRIVATE KEY HERE",
  /* other private keys for your contract account */
]);
//const rpc = new JsonRpc(`https://eos.greymass.com`, { fetch })
const rpc = new JsonRpc(`http://api.eosn.io`, { fetch });

const api = new Api({
  rpc,
  signatureProvider,
  textDecoder: new TextDecoder(),
  textEncoder: new TextEncoder(),
});

module.exports = {
  api,
};
