import { css } from "styled-components";

export const InputsCss = css`
  background-color: #000;
  color: #fff;
  width: 100%;
  border-radius: 8px;
  border: none;

  outline: transparent 2px solid;

  transition: 0.3s ease outline, 1s ease box-shadow;

  &:focus {
    outline: #e70dd3 2px solid;
    box-shadow: #e70dd388 0 0 50px;
  }
`;
