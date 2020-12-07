import { css, Global } from '@emotion/react';
import { colors } from '../util/colors';

export const globalStyles = (
  <Global
    styles={css`
      html,
      body {
        margin: 0;
        padding: 0;
        background: ${colors.light};
        min-height: 100%;
        font-family: monospace;
        font-size: 18px;
      }
      * {
        box-sizing: border-box;
      }
      .main {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      li {
        list-style: none;
        padding: 1em;
      }

      a {
        color: ${colors.hotpink};
        text-decoration: none;
        border-bottom: 5px solid rgba(1, 1, 1, 0);
      }
      a:hover {
        border-bottom: 5px solid ${colors.hotpink};
      }
      button {
        border: none;
        text-decoration: none;
        cursor: pointer;
        border: 3px solid black;
        border-radius: 5px;
        background-color: ${colors.light};
        font-size: 14px;
        font-family: monospace;
        padding: 0.3em;
        margin: 0.3em;
      }
      button:hover {
        color: ${colors.violett};
        border: 3px solid ${colors.violett};
      }

      input {
        border-radius: 5px;
        margin: 0.3em;
        width: 200px;
      }

      .questions input {
        margin-left: 0;
      }
      .header {
        background-color: ${colors.dark};
        width: 100vw;
        margin-top: -1em;
      }
      header ul {
        display: flex;
      }
      .container {
        min-height: 100vh;
        max-width: 80vw;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin-left: auto;
        margin-right: auto;
        padding-top: 1em;
      }
      .container div {
        margin-top: 0.5em;
      }
      .flex {
        min-height: 100vh;
        max-width: 80vw;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-left: auto;
        margin-right: auto;
      }

      .index div,
      .deleted div,
      .deleted a {
        margin: 1em;
        text-align: center;
        line-height: 1.3;
        align-self: center;
      }
      .index img {
        height: 200px;
        margin-bottom: 1em;
      }

      .login,
      .signup,
      .deleted {
        display: flex;
      }
      .login div,
      .signup div,
      .answers div {
        line-height: 1.5;
      }
      .login button,
      .signup button,
      .dashboard button,
      .answers button,
      .results button,
      .questions button {
        display: block;
        margin: 0;
        margin-top: 2em;
        width: 200px;
      }

      .surveycontainer {
        display: flex;
        flex-wrap: wrap;
        margin-top: 1em;
        margin-bottom: 1em;
        justify-content: flex-start;
      }

      .surveycontainer div {
        margin: 1em 0.5em 1em 0.5em;
        max-width: 100%;
      }
      .title {
        font-weight: bold;
      }
      .dashboard li {
        padding: 0;
        margin: 0;
      }
      .dashboard form {
        margin-top: 1em;
        margin-bottom: 1em;
      }
      .answers {
        max-width: 80vw;
        margin-left: auto;
        margin-right: auto;
        display: flex;
        flex-direction: column;
      }
      .answers .input-container {
        display: flex;
        position: relative;
      }
      .input-container label {
        margin-right: 1em;
        margin-bottom: 0.5em;
      }
      .answers label {
        margin-top: 1em;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .questions form {
        margin-top: 2em;
        display: flex;
        flex-direction: column;
      }
      .results .question-text {
        color: ${colors.red};
      }
      .results .instructions {
        margin-top: 3em;
      }
    `}
  />
);

export const headerStyles = css`
  display: flex;
`;
