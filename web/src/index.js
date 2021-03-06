import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from "react-redux";

import './index.css';
// import App from './App';
import * as serviceWorker from './serviceWorker';

import { BrowserRouter, Route, Switch } from 'react-router-dom';

import store from "./store/index";
import { addArticle, addToken } from "./actions/index";

import Header from './components/Header.jsx';

import SignInPage from './pages/SignIn.jsx';
import SignUpPage from './pages/SignUp.jsx';
import ProfilePage from './pages/Profile.jsx';
import ChatPage from './pages/Chat.jsx';
import MessagePage from './pages/Message.jsx';

import { Auth } from './components/Auth.jsx';

import "./styles/style.sass";

window.store = store;
window.addArticle = addArticle;
window.addToken = addToken;

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Auth failureRedirect="/sign-in"  />
      <Header />

      <Switch>
        <Route path="/sign-in" component={SignInPage} />
        <Route path="/sign-up" component={SignUpPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route exact path="/chat" component={ChatPage} />
        <Route path="/chat/:direction/:chatId" component={MessagePage} />
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
