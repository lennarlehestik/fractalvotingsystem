const fs = require(`fs`);
const path = require(`path`);
const { Serialize } = require(`eosjs`);
const { api } = require(`./config.js`);

deployContract({
  account: "ironscimitar",
  contractDir: `/Users/vlad/Desktop/edenoneos/artifacts`,
});

function getDeployableFilesFromDir(dir) {
  const dirCont = fs.readdirSync(dir);
  const wasmFileName = dirCont.find((filePath) =>
    filePath.match(/^eden_fractal*\.(wasm)$/gi)
  );
  const abiFileName = dirCont.find((filePath) =>
    filePath.match(/.*\.(abi)$/gi)
  );
  console.log(wasmFileName);
  if (!wasmFileName) throw new Error(`Cannot find a ".wasm file" in ${dir}`);
  if (!abiFileName) throw new Error(`Cannot find an ".abi file" in ${dir}`);
  return {
    wasmPath: path.join(dir, wasmFileName),
    abiPath: path.join(dir, abiFileName),
  };
}

async function deployContract({ account, contractDir }) {
  const { wasmPath, abiPath } = getDeployableFilesFromDir(contractDir);

  // 1. Prepare SETCODE
  // read the file and make a hex string out of it
  const wasm = fs.readFileSync(wasmPath).toString(`hex`);

  // 2. Prepare SETABI
  const buffer = new Serialize.SerialBuffer({
    textEncoder: api.textEncoder,
    textDecoder: api.textDecoder,
  });

  let abi = JSON.parse(fs.readFileSync(abiPath, `utf8`));
  const abiDefinition = api.abiTypes.get(`abi_def`);
  // need to make sure abi has every field in abiDefinition.fields
  // otherwise serialize throws
  abi = abiDefinition.fields.reduce(
    (acc, { name: fieldName }) =>
      Object.assign(acc, { [fieldName]: acc[fieldName] || [] }),
    abi
  );
  abiDefinition.serialize(buffer, abi);

  let actions = [
    {
      account: "eosio",
      name: "setcode",
      authorization: [
        {
          actor: "eden.fractal",
          permission: "active",
        },
      ],
      data: {
        account: "eden.fractal",
        vmtype: 0,
        vmversion: 0,
        code: wasm,
      },
    },
    {
      account: "eosio",
      name: "setabi",
      authorization: [
        {
          actor: "eden.fractal",
          permission: "active",
        },
      ],
      data: {
        account: "eden.fractal",
        abi: Buffer.from(buffer.asUint8Array()).toString(`hex`),
      },
    },
  ];

  let seActions = await api.serializeActions(actions);
  //console.log(seActions[0].data)
  //console.log(seActions[1].data)

  // BUILD THE MULTISIG PROPOSE TRANSACTION
  actionData = {
    proposer: account,
    proposal_name: "updatee",

    requested: [
      {
        actor: "edenmsig1111",
        permission: "active",
      },
      {
        actor: "chuckcd.gm",
        permission: "active",
      },
      {
        actor: "dan",
        permission: "active",
      },
      {
        actor: "felix.gm",
        permission: "active",
      },
      {
        actor: "james.vr",
        permission: "active",
      },
      {
        actor: "vladislav.x",
        permission: "active",
      },
      {
        actor: "ncoltd123451",
        permission: "active",
      },
    ],
    trx: {
      expiration: "2022-09-10T16:39:15",
      ref_block_num: 0,
      ref_block_prefix: 0,
      max_net_usage_words: 0,
      max_cpu_usage_ms: 0,
      delay_sec: 0,
      context_free_actions: [],
      actions: [
        {
          account: "eosio",
          name: "setcode",
          authorization: [
            {
              actor: "eden.fractal",
              permission: "active",
            },
          ],
          data: seActions[0].data,
        },
        {
          account: "eosio",
          name: "setabi",
          authorization: [
            {
              actor: "eden.fractal",
              permission: "active",
            },
          ],
          data: seActions[1].data,
        },
      ],
      transaction_extensions: [],
    },
  };

  try {
    const result = await api.transact(
      {
        actions: [
          {
            account: "eosio.msig",
            name: "propose",
            authorization: [
              {
                actor: account,
                permission: "owner",
              },
            ],
            data: actionData,
          },
        ],
      },
      {
        blocksBehind: 3,
        expireSeconds: 30,
        broadcast: true,
        sign: true,
      }
    );
    console.log(result);
  } catch (e) {
    console.log("Caught exception: " + e);
    if (e instanceof RpcError) {
      console.log(JSON.stringify(e.json, null, 2));
    }
  }
}

/*

cleos -u https://eos.greymass.com  multisig approve ironscimitar kakspluskaks '{"actor": "vladislav.x", "permission": "active"}' -p vladislav.x@active







// 3. Send transaction with both setcode and setabi actions
const result = await api.transact(
  {
    actions: [
      {
        account: 'eosio',
        name: 'setcode',
        authorization: [
          {
            actor: account,
            permission: 'active',
          },
        ],
        data: {
          account: account,
          vmtype: 0,
          vmversion: 0,
          code: wasm,
        },
      },
      {
        account: 'eosio',
        name: 'setabi',
        authorization: [
          {
            actor: account,
            permission: 'active',
          },
        ],
        data: {
          account: account,
          abi: Buffer.from(buffer.asUint8Array()).toString(`hex`),
        },
      },
    ],
  },
  {
    blocksBehind: 3,
    expireSeconds: 30,
  }
)
}
*/

// CREATE ACTION TO PROPOSE

// SEND THE MULTISIG PROPOSE
