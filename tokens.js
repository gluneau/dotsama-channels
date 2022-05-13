const { ApiPromise, WsProvider } = require("@polkadot/api");

async function queryInfo(api) {
  // const assetMetadata = await api.query.assetRegistry.assetMetadatas.entries();  // Acala, Karura, Bifrost
  // const assetMetadata = await api.query.assetRegistry.assets.entries();          // Basilisk
  // const assetMetadata = await api.query.currencies.dicoAssetsInfo.entries();     // Kico, Dico
  const assetMetadata = await api.query.assets.metadata.entries(); // most

  assetMetadata.map((asset) => {
    let h = asset[1].toHuman();
    console.log(JSON.stringify(h));
  });
}

async function setup() {
  const wsProvider = new WsProvider(
    "wss://pichiu-rococo-01.onebitdev.com/public-ws"
  );
  const api = await ApiPromise.create({
    provider: wsProvider,
  });

  await queryInfo(api);
  await api.disconnect();
}

setup();
