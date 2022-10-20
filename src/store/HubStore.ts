import { makeAutoObservable, runInAction } from "mobx";
import { RootStore } from "./RootStore";
import { HubState, HubStateSchema, Person } from "../types/HubState";
import { sign } from "../helpers/sign";
import { PostBody, PostBodyUnsigned } from "../types/PostBody";
import { digest } from "../helpers/digest";
import identity from "../helpers/identity";

export class HubStore {
  constructor(private root: RootStore) {
    makeAutoObservable(this);
  }

  error = false;

  ws: WebSocket | undefined;

  online = false;
  connecting = false;
  to?: number;

  message = "";

  async setNickname(nickname: string) {
    if (this.me) this.me.title = nickname;
    else if (this.root.identityStore.keyPair) {
      await this.sendNickname(nickname);
    }
  }

  get nickname() {
    return this.me?.title || "";
  }

  get me(): Person | undefined {
    if (!this.root.identityStore.identityDigest) return undefined;

    return this.state.persons.find(
      (p) => p.identity === this.root.identityStore.identityDigest
    );
  }

  state: HubState = {
    persons: [],
    messages: [],
  };

  async sendNickname(nickname?: string) {
    if (
      !this.root.identityStore.keyPair ||
      !this.root.identityStore.identityDigest
    )
      throw "[HubStore] No keypair";
    if (!this.ws) throw "[HubStore] No websocket open";

    try {
      const person: Person = this.me || {
        identity:
          this.root.identityStore.identityDigest ||
          (await identity(this.root.identityStore.keyPair.publicKey)),
        title: nickname || "",
      };

      const postBodyUnsigned: PostBodyUnsigned = {
        type: "PERSON",
        body: JSON.stringify(this.me || person),
        publicKey: await crypto.subtle.exportKey(
          "jwk",
          this.root.identityStore.keyPair?.publicKey
        ),
      };

      const signature = await sign(
        JSON.stringify(postBodyUnsigned),
        this.root.identityStore.keyPair
      );

      const postBody: PostBody = { ...postBodyUnsigned, signature: signature };
      this.ws.send(JSON.stringify(postBody));

      runInAction(() => (this.message = ""));
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async send() {
    if (!this.root.identityStore.keyPair) throw "[HubStore] No keypair";
    if (!this.ws) throw "[HubStore] No websocket open";

    if (!this.message.trim()) return;

    try {
      // send empty nickname
      if (!this.me) await this.sendNickname("");

      const postBodyUnsigned: PostBodyUnsigned = {
        type: "MESSAGE",
        body: this.message,
        publicKey: await crypto.subtle.exportKey(
          "jwk",
          this.root.identityStore.keyPair?.publicKey
        ),
      };

      const signature = await sign(
        JSON.stringify(postBodyUnsigned),
        this.root.identityStore.keyPair
      );

      const postBody: PostBody = { ...postBodyUnsigned, signature: signature };
      this.ws.send(JSON.stringify(postBody));
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  close() {
    this.ws?.close();
    this.ws = undefined;
    this.online = false;
    window.setTimeout(() => {
      runInAction(() => (this.connecting = false));
      window.clearTimeout(this.to);
    }, 100);
  }

  async connect(): Promise<void> {
    if (!this.root.identityStore.keyPair) {
      this.error = true;
      console.error("[HubStore] No keypair");
      return;
    }

    this.connecting = true;

    try {
      const ws = new WebSocket(`${process.env.REACT_APP_WS_URL}/ws/`);

      if (!ws)
        console.error("[HubStore.connect] Rejecting websocket connection");

      ws.addEventListener("open", async () => {
        runInAction(() => {
          this.online = true;
          this.connecting = false;
        });

        if (!this.root.identityStore.keyPair || !this.ws) return;

        const handshakeUnsigned: PostBodyUnsigned = {
          type: "HANDSHAKE",
          body: await digest(`${Date.now()}`),
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

        // send handshake
        this.ws.send(JSON.stringify(handshake));
      });

      ws.addEventListener("close", () => {
        runInAction(() => {
          this.online = false;
          this.connecting = true;
          this.to = window.setTimeout(() => this.connect(), 2000);
        });
      });

      ws.addEventListener("message", async ({ data }) => {
        try {
          const obj = JSON.parse(data);
          await HubStateSchema.validate(obj);
          const hubState = obj as HubState;

          runInAction(() => (this.state = hubState));
        } catch (e) {
          console.error(e);
        }
      });

      runInAction(async () => {
        if (!this.root.identityStore.keyPair) return;
        this.ws = ws;
      });
    } catch (e) {
      runInAction(() => (this.error = true));
    }
  }
}
