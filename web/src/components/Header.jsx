import React, { Component } from 'react';
import Modal from 'react-modal';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';

import axios from 'axios';

import { removeAuthentication } from "../actions/index";

import { SearchUsersButton } from "./Users.jsx";
import { LogoutBtn } from "./Auth.jsx";

import "../styles/header.sass";

Modal.setAppElement('#root');

const mapStateToProps = state => {
  return { isAuthenticated: state.isAuthenticated };
};

const Navigation = ({isAuthenticated}) => (
  <div>
    {
      isAuthenticated == false ? (
        <nav className="navigation">
          <li className="navigation__item"><Link to="/sign-in">login</Link></li>
          <li className="navigation__item"><Link to="/sign-up">sign up</Link></li>
        </nav>
      ) : (
        <nav className="navigation">
          <li className="navigation__item"><Link to="/profile">home</Link></li>
          <li className="navigation__item"><Link to="/chat">chat</Link></li>
          <li className="navigation__item"><LogoutBtn /></li>
        </nav>
      )
    }
  </div>
);

const Logo = () => (
  <Link className="logo" to="/profile"><img src="https://www.okko.ua/adaptive/img/header/big-logo.svg" alt="logo" /></Link>
);

const HeaderComponent = ({isAuthenticated}) => (
  <header className="header">
    <Logo />
    {isAuthenticated ? <SearchUsersButton /> : null}
    <Navigation isAuthenticated={isAuthenticated}/>
  </header>
);

const Header = connect(mapStateToProps)(HeaderComponent);

export default Header;
