import React from "react";
import styled from "styled-components";

export const LayoutDefault = styled.div`
  place-self: center;
  align-self: stretch;
  width: 700px;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr auto;
  justify-items: center;
  align-items: center;
`;
