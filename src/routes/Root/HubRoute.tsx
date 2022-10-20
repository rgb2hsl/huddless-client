import React, { useCallback, useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../store/RootStore";
import { useRedirectIfNotLoaded } from "../../hooks/useRedirectToRoot";
import { runInAction } from "mobx";
import { MsgPanel } from "../../components/MsgPanel/MsgPanel";
import { Button } from "../../components/LinkButton";
import { LayoutHub } from "../../components/Layout/LayoutHub";
import { MsgInput, MsgInputSimple } from "../../components/MsgPanel/MsgInput";
import { MsgLog } from "../../components/MsgPanel/MsgLog";
import { MsgPanelContainer } from "../../components/MsgPanel/MsgPanelContainer";
import {
  MsgBuble,
  MsgDate,
  MsgMessage,
  MsgPerson,
} from "../../components/MsgPanel/MsgBubble";
import { MsgLogContainer } from "../../components/MsgPanel/MsgLogContainer";
import { MsgStatus } from "../../components/MsgPanel/MsgStatus";
import { Person } from "../../types/HubState";

export const HubRoute = observer(() => {
  const scrollAnchor = useRef<HTMLDivElement>(null);
  const store = useStore();
  useRedirectIfNotLoaded(store);

  useEffect(() => {
    scrollAnchor.current?.scrollIntoView();
  }, [store.hubStore.state.messages]);

  useEffect(() => {
    store.hubStore.connect();
    return () => store.hubStore.close();
  }, []);

  const handleMessageChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      runInAction(() => (store.hubStore.message = e.target.value));
    },
    [store, store.hubStore]
  );

  const handleMessageKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (!e.shiftKey && e.key === "Enter") {
        e.preventDefault();
        if (store.hubStore.online) {
          store.hubStore
            .send()
            .then(() => runInAction(() => (store.hubStore.message = "")));
        }
      }
    },
    [store, store.hubStore]
  );

  const handleNicknameKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (store.hubStore.online) {
          store.hubStore
            .sendNickname()
            .then(() => runInAction(() => (store.hubStore.message = "")));
        }
      }
    },
    [store, store.hubStore]
  );

  const handleNicknameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      runInAction(() => {
        const nickname = e.target.value.replace("\n", "").trim();

        runInAction(
          async () =>
            await store.hubStore.setNickname(
              nickname.length <= 20 ? nickname : nickname.substring(0, 19)
            )
        );
      });
    },
    [store, store.hubStore]
  );

  const handleSend = useCallback(() => {
    store.hubStore
      .send()
      .then(() => runInAction(() => (store.hubStore.message = "")));
  }, [store, store.hubStore]);

  return (
    <LayoutHub>
      <MsgLogContainer>
        <MsgLog>
          {store.hubStore.state.messages.map((msg, i, n) => {
            const first = !n[i - 1] || n[i - 1].identity !== msg.identity;
            const last = !n[i + 1] || n[i + 1].identity !== msg.identity;
            const person: Person | undefined = first
              ? store.hubStore.state.persons.find(
                  (p) => p.identity === msg.identity
                )
              : undefined;
            const me = msg.identity === store.hubStore.me?.identity;

            return (
              <MsgBuble key={i}>
                {first ? (
                  <>
                    <MsgPerson me={me}>
                      {person?.title || msg.identity.substring(0, 6)}
                    </MsgPerson>
                    <MsgDate me={me}>{`${msg.date}`}</MsgDate>
                  </>
                ) : null}
                <MsgMessage first={first} last={last} me={me}>
                  {msg.body}
                </MsgMessage>
              </MsgBuble>
            );
          })}
          <div ref={scrollAnchor} />
        </MsgLog>
      </MsgLogContainer>

      <MsgPanelContainer>
        <MsgPanel>
          <MsgInputSimple
            value={store.hubStore.nickname}
            onChange={handleNicknameChange}
            onKeyDown={handleNicknameKeyDown}
            placeholder={"Nickname"}
          />
          <MsgInput
            value={store.hubStore.message}
            onChange={handleMessageChange}
            onKeyDown={handleMessageKeyDown}
            placeholder={"Message"}
          />
          <Button onClick={handleSend} disabled={!store.hubStore.online}>
            Send
          </Button>
          <MsgStatus store={store} />
        </MsgPanel>
      </MsgPanelContainer>
    </LayoutHub>
  );
});
