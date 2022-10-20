import React from "react";
import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed,
  figure, figcaption, footer, header, hgroup,
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }

  html, body, #root {
    height: 100%;
  }

  * {
    box-sizing: border-box;
  }

  article, aside, details, figcaption, figure,
  footer, header, hgroup, menu, nav, section {
    display: block;
  }

  body {
    line-height: 1;
  }

  ol, ul {
    list-style: none;
  }

  blockquote, q {
    quotes: none;
  }

  blockquote:before, blockquote:after,
  q:before, q:after {
    content: '';
    content: none;
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  body {
    background-color: #282f31;
    font-family: "Courier New", monospace;
    color: #cef1ed;
    font-size: 18px;
  }

  h1 {
    font-size: 2em;
    font-weight: bold;
    margin: 16px 0;
  }

  p {
    margin: 8px 0;
    line-height: 1.3;
  }

  small {
    font-size: 14px;
    line-height: 1;
  }

  @keyframes error-blink {
    0% {
      color: #ffb5b5;
      text-shadow: 0 0 5px #f00;
    }
    50% {
      color: #d54949;
      text-shadow: 0 0 50px #d32828;
    }
    100% {
      color: #ffb5b5;
      text-shadow: 0 0 5px #f00;
    }
  }

  @keyframes info-blink {
    0% {
      color: #b5f1ff;
      text-shadow: 0 0 5px #0094f6;
    }
    50% {
      color: #00bee3;
      text-shadow: 0 0 5px #003557;
    }
    100% {
      color: #b5f1ff;
      text-shadow: 0 0 5px #0094f6;
    }
  }
`;
