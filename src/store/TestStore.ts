import { makeAutoObservable, runInAction } from "mobx";
import axios, { AxiosError } from "axios";
import { RootStore } from "./RootStore";
import { sign } from "../helpers/sign";
import { PostBody, PostBodyUnsigned } from "../types/PostBody";

export class TestStore {
  constructor(private root: RootStore) {
    makeAutoObservable(this);
  }

  loading = false;

  result?: boolean;
  status?: number;
  error?: any;

  get text() {
    if (this.loading) return undefined;
    if (this.error) return "getting error";
    if (this.result !== undefined) {
      return this.result ? "ok" : "not ok";
    }
  }

  async sigcheck(): Promise<void> {
    if (!this.root.identityStore.keyPair) return;

    this.loading = true;

    try {
      const handshakeUnsigned: PostBodyUnsigned = {
        type: "PERSON",
        body: "{}",
        publicKey: await crypto.subtle.exportKey(
          "jwk",
          this.root.identityStore.keyPair?.publicKey
        ),
      };

      const signature = await sign(
        JSON.stringify(handshakeUnsigned),
        this.root.identityStore.keyPair
      );

      const handshake: PostBody = {
        ...handshakeUnsigned,
        signature: signature,
      };

      const response = await axios.post<{
        result: boolean;
      }>(`${process.env.REACT_APP_BACKEND_URL}/sigcheck/`, handshake);

      runInAction(() => {
        this.result = response.data.result;
        this.status = response.status;
        this.loading = false;
      });
    } catch (e) {
      console.error("[SIGCHECK]", e);

      if (axios.isAxiosError(e)) {
        const ae = e as AxiosError;
        runInAction(() => {
          this.error = ae.response?.data;
          this.status = ae.status;
          this.loading = false;
        });
      } else {
        runInAction(() => {
          this.error = e;
          this.loading = false;
        });
      }
    }
  }
}
