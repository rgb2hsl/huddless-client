import React from "react";
import styled from "styled-components";

export const Elipsis = styled.div`
  @media (max-width: 1023px) {
    width: 90vw;
    white-space: nowrap;
    overflow: hidden;
    box-sizing: border-box;
    text-overflow: ellipsis;
  }
`;
