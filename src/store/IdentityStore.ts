import { autorun, makeAutoObservable, runInAction } from "mobx";
import { RootStore } from "./RootStore";
import { deleteKeyPair, getKeyPair, storeKeyPair } from "../keypairStorage";
import identity from "../helpers/identity";

// TODO идея: 1. генерация extractable ключей 2. СОХРАНИТЕ КЛЮЧИ В ФАЙЛИК 3. импорт ключей в storage и сохранение в IndexedDB 4. профит
// TODO https://github.com/diafygi/webcrypto-examples#ecdsa---importkey --- ИМПОРТ КЛЮЧЕЙ
// TODO https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
// TODO const keypair = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
// TODO https://www.w3.org/TR/WebCryptoAPI/#concepts-key-storage

export interface JWKPair {
  publicKey: JsonWebKey;
  privateKey: JsonWebKey;
}

export class IdentityStore {
  identityDigest?: string;

  keyPair?: CryptoKeyPair;

  clearKeyPair() {
    this.keyPair = undefined;
  }

  error = false;

  async deleteKeyPair() {
    await deleteKeyPair();
    runInAction(() => (this.keyPair = undefined));
  }

  async loadJWKPair(jwkPair = this.jwkPair) {
    if (jwkPair) {
      try {
        const keypair: CryptoKeyPair = {
          publicKey: await window.crypto.subtle.importKey(
            "jwk",
            jwkPair.publicKey,
            {
              name: "ECDSA",
              namedCurve: "P-256",
            },
            true,
            ["verify"]
          ),
          privateKey: await window.crypto.subtle.importKey(
            "jwk",
            jwkPair.privateKey,
            {
              name: "ECDSA",
              namedCurve: "P-256",
            },
            false,
            ["sign"]
          ),
        };

        await storeKeyPair(keypair);

        runInAction(() => {
          this.keyPair = keypair;
          this.jwkPair = undefined;
        });
      } catch {
        runInAction(() => (this.error = true));
      }
    }
  }

  jwkPair?: JWKPair;

  clearJWKPair() {
    this.jwkPair = undefined;
  }

  async generateJWKPair() {
    const keypair: CryptoKeyPair = await crypto.subtle.generateKey(
      { name: "ECDSA", namedCurve: "P-256" },
      true,
      ["sign", "verify"]
    );

    const jwkPair: JWKPair = {
      publicKey: await crypto.subtle.exportKey("jwk", keypair.publicKey),
      privateKey: await crypto.subtle.exportKey("jwk", keypair.privateKey),
    };

    runInAction(() => (this.jwkPair = jwkPair));
  }

  async getKeyPairFromDB() {
    const keypair = await getKeyPair();
    if (keypair) {
      runInAction(() => {
        this.keyPair = keypair;
        this.loading = false;
      });
    } else {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  loading = true;

  constructor(private root: RootStore) {
    makeAutoObservable(this);
    this.getKeyPairFromDB();

    // identityDigest setting
    autorun(() => {
      if (this.keyPair?.publicKey) {
        crypto.subtle.exportKey("jwk", this.keyPair.publicKey).then(
          (pk) =>
            runInAction(async () => (this.identityDigest = await identity(pk))),
          () => runInAction(() => (this.identityDigest = undefined))
        );
      } else {
        runInAction(() => (this.identityDigest = undefined));
      }
    });
  }
}
