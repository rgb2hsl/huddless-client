import React from "react";
import styled from "styled-components";

interface MsgMessageProps {
  first?: boolean;
  last?: boolean;
  me?: boolean;
}

export const MsgMessage = styled.div<MsgMessageProps>`
  padding: 8px 12px;
  color: #fff;
  background-color: ${(props) => (props.me ? "#00253f" : "#121618")};
  border: none;
  font-size: 16px;
  font-family: "Courier New", monospace;
  line-height: 22px;

  border-radius: ${(props) => {
    if (props.last && props.first) return "8px";
    if (props.first) return "8px 8px 0 0";
    if (props.last) return "0 0 8px 8px";
  }};

  grid-area: message;
`;

interface MsgDateProps {
  me?: boolean;
}

export const MsgDate = styled.div<MsgDateProps>`
  color: ${(props) => (props.me ? "#00bee3" : "#fff")};
  opacity: 0.5;
  border: none;
  font-size: 12px;
  font-family: "Courier New", monospace;
  font-weight: bolder;
  line-height: 16px;
  margin-bottom: 4px;
  margin-top: 12px;

  grid-area: date;
`;

interface MsgPersonProps {
  me?: boolean;
}

export const MsgPerson = styled.div<MsgPersonProps>`
  padding: 0 12px;
  color: ${(props) => (props.me ? "#00bee3" : "#fff")};
  border: none;
  font-size: 16px;
  font-family: "Courier New", monospace;
  font-weight: bolder;
  line-height: 16px;
  margin-bottom: 4px;
  margin-top: 12px;

  grid-area: person;
`;

export const MsgBuble = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: auto auto;
  grid-template-areas:
    "person empty date"
    "message message message";
`;
