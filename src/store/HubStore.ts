import {
  IObservableArray,
  makeAutoObservable,
  observable,
  runInAction,
} from "mobx";
import { RootStore } from "./RootStore";
import { Message, Person, SystemMessage } from "../types/HubState";
import { sign } from "../helpers/sign";
import { PersonHandshake, PostBody, PostBodyUnsigned } from "../types/PostBody";
import {
  MessagePayload,
  MessagePayloadSchema,
  Payload,
  PayloadSchema,
  PersonPayloadSchema,
  PersonsPayload,
  SystemMessagePayload,
  SystemMessagePayloadSchema,
} from "../types/Messages";

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

  setNickname(nickname: string) {
    this.nickname = nickname;
  }

  nickname = "";

  persons: IObservableArray<Person> = observable<Person>([]);
  messages: IObservableArray<Message | SystemMessage> = observable<
    Message | SystemMessage
  >([]);

  async sendNickname(nickname?: string) {
    if (
      !this.root.identityStore.keyPair ||
      !this.root.identityStore.identityDigest
    )
      throw "[HubStore] No keypair";
    if (!this.ws) throw "[HubStore] No websocket open";

    if (!nickname) {
      nickname = this.nickname;
    }

    try {
      const person: Person = {
        identity: this.root.identityStore.identityDigest,
        title: nickname,
      };

      const postBodyUnsigned: PostBodyUnsigned = {
        type: "PERSON",
        body: JSON.stringify(person),
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
    if (
      !this.root.identityStore.keyPair ||
      !this.root.identityStore.identityDigest
    ) {
      this.error = true;
      console.error("[HubStore] No keypair or identityDigest");
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

        if (
          !this.root.identityStore.keyPair ||
          !this.ws ||
          !this.root.identityStore.identityDigest
        ) {
          console.error(
            "[HubStore][WS open handler] No keypair or identityDigest"
          );
          return;
        }

        const personHandshake: PersonHandshake = {
          identity: this.root.identityStore.identityDigest,
        };

        const personUnsigned: PostBodyUnsigned = {
          type: "PERSON",
          body: JSON.stringify(personHandshake),
          publicKey: await crypto.subtle.exportKey(
            "jwk",
            this.root.identityStore.keyPair?.publicKey
          ),
        };

        const signature = await sign(
          JSON.stringify(personUnsigned),
          this.root.identityStore.keyPair
        );

        const handshake: PostBody = {
          ...personUnsigned,
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
        let obj;

        try {
          obj = JSON.parse(data);
        } catch (e) {
          console.error(
            "[HubStore][WS message handler] Failed to parse incoming message"
          );
          return;
        }

        try {
          await PayloadSchema.validate(obj);
        } catch {
          console.error(
            "[HubStore][WS message handler] Incoming message is not a valid payload",
            obj
          );
          return;
        }

        const payload: Payload = obj as Payload;

        /** Switch payload type */

        if (payload.type === "PERSONS") {
          try {
            PersonPayloadSchema.validate(payload);
          } catch {
            console.error(
              "[HubStore][WS message handler] Incoming message is invalid persons payload"
            );
            return;
          }

          runInAction(() => {
            const personsPayload = payload as PersonsPayload;

            try {
              this.persons.replace(personsPayload.body);
            } catch {
              console.error(
                "[HubStore][WS message handler] An error occured during persons payload processing"
              );
              return;
            }

            const me = personsPayload.body.find(
              (p) => p.identity === this.root.identityStore.identityDigest
            );

            if (me) {
              this.nickname = me.title; // update my nickname with saved one
            }
          });
        } else if (payload.type === "MESSAGE") {
          try {
            MessagePayloadSchema.validate(payload);
          } catch {
            console.error(
              "[HubStore][WS message handler] Incoming message is invalid message payload"
            );
            return;
          }

          const messagePayload = payload as MessagePayload;
          this.messages.push(messagePayload.body);
        } else if (payload.type === "SYSTEM_MESSAGE") {
          try {
            SystemMessagePayloadSchema.validate(payload);
          } catch {
            console.error(
              "[HubStore][WS message handler] Incoming message is invalid system message payload"
            );
            return;
          }

          const systemMessagePayload = payload as SystemMessagePayload;
          this.messages.push(systemMessagePayload.body);
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
