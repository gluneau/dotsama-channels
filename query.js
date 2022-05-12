const { ApiPromise, WsProvider } = require("@polkadot/api");
const { hexToString } = require("@polkadot/util");

function decodeServiceChainRecord(serviceDetails) {
  const id = hexToString(serviceDetails.id.toString());
  return {
    id,
    types: serviceDetails.serviceTypes.map((type) =>
      hexToString(type.toString())
    ),
    urls: serviceDetails.urls.map((url) => hexToString(url.toString())),
  };
}

async function queryInfo(api, candidate) {
  const maybeLinkRecord = await api.query.didLookup.connectedDids(candidate);

  if (maybeLinkRecord.isNone) {
    console.log("No record for this address");
    return;
  }

  const didAddress = maybeLinkRecord.unwrap().did.toString();

  const [encodedW3N, encodedServiceEndpoints] = await Promise.all([
    api.query.web3Names.names(didAddress),
    api.query.did.serviceEndpoints.entries(didAddress),
  ]);

  const w3n = encodedW3N.isSome ? encodedW3N.unwrap().toUtf8() : null;
  const serviceEndpoints = encodedServiceEndpoints.map(
    ([, encodedEndpoint]) => {
      return decodeServiceChainRecord(encodedEndpoint.unwrap());
    }
  );

  console.log(`Address ${candidate}`);
  console.log(`  -> did:kilt:${didAddress}`);
  console.log(`    -> w3n:${w3n}`);
  console.log(
    `    -> Service endpoints ${JSON.stringify(serviceEndpoints, null, " ")}`
  );
}

async function setup() {
  const wsProvider = new WsProvider("wss://kilt-rpc.dwellir.com");
  const api = await ApiPromise.create({
    provider: wsProvider,
  });

  const candidate = "op7G2ofug2Q2n1Bq3uUGzkNdSp68S93beMQkjjyDxnPREnk";
  await queryInfo(api, candidate);

  await api.disconnect();
}

setup();
