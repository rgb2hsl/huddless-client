import React from "react";
import styled from "styled-components";
import { observer } from "mobx-react-lite";
import { RootStore } from "../../store/RootStore";
import { Info } from "../Info/Info";
import { Danger } from "../Danger/Danger";
import { Spinner } from "../Spinner";

const MsgStatusContainer = styled.div`
  margin: 0 16px;
`;

export const MsgStatus: React.FC<{
  store: RootStore;
}> = observer(({ store }) => (
  <MsgStatusContainer>
    {store.hubStore.connecting ? (
      <>
        <Info>
          Connecting ... <Spinner />
        </Info>
      </>
    ) : store.hubStore.online ? (
      <>Online</>
    ) : (
      <>
        <Danger>Offline</Danger>
      </>
    )}
  </MsgStatusContainer>
));
