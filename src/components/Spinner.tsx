import React from "react";
import styled from "styled-components";

const SpinnerSpan = styled.span`
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  animation: spin 1s infinite linear;
`;

export const Spinner = () => <SpinnerSpan>⏳</SpinnerSpan>;
