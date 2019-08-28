import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from "react-redux";

import './index.css';
// import App from './App';
import * as serviceWorker from './serviceWorker';

import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Login from './components/Login';
import Home from './App';
import SignUp from './components/SignUp'

import Header from './components/Header';

import store from "./store/index";
import { addArticle, addToken } from "./actions/index";

window.store = store;
window.addArticle = addArticle;
window.addToken = addToken;

store.subscribe(() => console.log('Look ma, Redux!!'));

console.log(store.getState());

store.dispatch( addArticle({ title: 'React Redux Tutorial for Beginners', id: 1 }) )
// store.dispatch( addToken({ val: 'token', id: 1 }) )

console.log(store.getState());

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Header />

      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/sign-up" component={SignUp} />
        <Route path="/" component={Home} />
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

// ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
