import React from "react";
import styled from "styled-components";

export const Wrapper = styled.div`
  align-self: stretch;
  justify-self: stretch;
  width: 100%;
  height: 100%;

  padding: 32px;

  @media (max-width: 1023px) {
    padding: 16px;
  }

  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  justify-items: center;
  align-items: center;
`;
