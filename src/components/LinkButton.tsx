import React from "react";
import styled, { css } from "styled-components";
import { Link } from "react-router-dom";

type LinkButtonSize = "default" | "big";

const fontSize = (size?: LinkButtonSize) =>
  size === "default" ? "14px" : size === "big" ? "18px" : "14px";

const padding = (size?: LinkButtonSize) =>
  size === "default" ? "2px 12px" : size === "big" ? "4px 20px" : "2px 12px";

interface LinkButtonProps {
  size?: LinkButtonSize;
  disabled?: boolean;
}

const styleNotDisabled = css<LinkButtonProps>`
  &:hover {
    color: #fff;
    background-color: #e70dd3;
    top: -1px;
    box-shadow: rgba(196, 4, 185, 0.8) 3px 3px 20px;
  }

  &:active {
    transition: 0.2s ease background-color, 0.2s ease top, 0.2s ease box-shadow;
    background-color: #355672;
    top: 1px;
    box-shadow: rgba(0, 30, 49, 0.5) 3px 3px 5px;
  }
`;

const styleDisabled = css<LinkButtonProps>`
  background-color: #3e4144;
  color: #212b31;
`;

const style = css<LinkButtonProps>`
  font-family: monospace;
  font-size: ${(props) => fontSize(props.size)};
  background-color: #6ea7d5;
  color: #08202d;
  display: inline-block;
  padding: ${(props) => padding(props.size)};
  border: none;
  cursor: pointer;
  position: relative;
  top: 0;

  transition: 0.3s ease background-color, 0.3s ease color, 0.2s ease top,
    1.8s ease box-shadow;

  ${(props) => (!props.disabled ? styleNotDisabled : styleDisabled)}
`;

export const LinkButton = styled(Link)<LinkButtonProps>`
  text-decoration: none;
  ${style}
`;

export const Button = styled.button<LinkButtonProps>`
  ${style}
`;
