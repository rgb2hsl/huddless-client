import { openDB } from "idb";

const keypairStorage = openDB("HuddlessIdentity", 1, {
  upgrade(db) {
    db.createObjectStore("identity");
  },
});

export async function getKeyPair(): Promise<CryptoKeyPair | undefined> {
  return (await keypairStorage).get("identity", "keypair");
}

export async function storeKeyPair(keyPair: CryptoKeyPair) {
  return (await keypairStorage).put("identity", keyPair, "keypair");
}

export async function deleteKeyPair() {
  return (await keypairStorage).delete("identity", "keypair");
}

export async function clear() {
  return (await keypairStorage).clear("identity");
}
