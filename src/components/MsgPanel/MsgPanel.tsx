import React from "react";
import styled from "styled-components";

export const MsgPanel = styled.div`
  width: 100%;
  padding: 16px;
  background-color: #08191e;

  display: grid;

  @media (min-width: 1366px) {
    grid-template-columns: auto 700px auto auto;
    grid-template-rows: 1fr;
    grid-template-areas: "nickname message controls status";
  }

  @media (min-width: 1024px) and (max-width: 1365px) {
    grid-template-columns: auto 500px auto auto;
    grid-template-rows: 1fr;
    grid-template-areas: "nickname message controls status";
  }

  @media (max-width: 1023px) {
    grid-template-columns: 1fr auto;
    grid-template-rows: auto auto;
    grid-template-areas:
      "message controls"
      "nickname status";
  }

  justify-content: center;

  justify-items: center;
  align-items: center;
`;

export const MsgPanelNickname = styled.div`
  grid-area: nickname;
  @media (max-width: 1024px) {
    justify-self: stretch;
  }
`;

export const MsgPanelMessage = styled.div`
  grid-area: message;
  justify-self: stretch;
`;

export const MsgPanelControls = styled.div`
  grid-area: controls;
`;

export const MsgPanelStatus = styled.div`
  grid-area: status;
`;
