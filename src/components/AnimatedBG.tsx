import React from "react";
import styled from "styled-components";

export const AnimatedBG = styled.div`
  align-self: stretch;
  justify-self: stretch;
  width: 100%;
  height: 100%;

  background: linear-gradient(
    -45deg,
    #282f31,
    #324e5b,
    #282f31,
    #2f2649,
    #282f31,
    #1c2638,
    #282f31
  );
  background-size: 800% 400%;
  animation: gradient 30s ease infinite;

  @keyframes gradient {
    0% {
      background-position: 0 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0 50%;
    }
  }
`;
