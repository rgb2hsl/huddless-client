import React from "react";
import styled, { css } from "styled-components";
import TextareaAutosize from "react-textarea-autosize";

const style = css`
  background-color: transparent;
  color: #fff;
  border: none;
  outline: none;
  resize: none;
  font-size: 16px;
  font-family: "Courier New", monospace;
  line-height: 22px;
  width: 100%;
  padding: 5px;
`;

export const MsgInput = styled(TextareaAutosize)`
  ${style};
`;

export const MsgInputSimple = styled.input`
  ${style};
`;
