import { action, createStore, StoreProvider, persist } from "easy-peasy";
import React from "react";
import ReactDOM from "react-dom";
import Root from "./app/indra/components/root";
import './index.css';
import theme from './app/theme';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles'

// https://easy-peasy.now.sh/
const store = createStore(
  persist({
    token: undefined,
    setToken: action((state, payload) => {
      state.token = payload;
    }),
  }),
  {
  language: 'CZ',
  items: ['Create store', 'Wrap application', 'Use store'],
  add: action((state, payload) => {
    state.items.push(payload);
  }),
  setLang: action((state, payload) => {
    state.language = payload;
  }),
});

ReactDOM.render(
  <StoreProvider store={store}>
    <MuiThemeProvider theme={theme}>
      <Root />
    </MuiThemeProvider>
  </StoreProvider>,
  document.getElementById("root")
);
