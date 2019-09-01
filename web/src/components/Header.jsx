import React, { Component } from 'react';
import Modal from 'react-modal';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';

import axios from 'axios';

import { removeAuthentication } from "../actions/index";

import { SearchUsersButton } from "./Users.jsx";

Modal.setAppElement('#root');

const mapStateToProps = state => {
  return { isAuthenticated: state.isAuthenticated };
};

function mapDispatchToProps(dispatch) {
  return {
    removeAuthentication: () => dispatch(removeAuthentication())
  };
}

const Navigation = () => (
  <nav>
    <li><Link to="sign-in">login</Link></li>
    <li><Link to="sign-up">sign up</Link></li>
    <li><Link to="profile">home</Link></li>
    <li><Link to="chat">chat</Link></li>
  </nav>
);

const LogoutBtn = props => (
  <span {...props}>{props.children || 'logout'}</span>
);



class HeaderComponent extends Component {
  constructor(props) {
    super(props);


  }

  logout = () => {
    axios
      .post('/api/auth/logout', { token: localStorage.getItem('token') })
      .then(() => {
        this.props.removeAuthentication();
        localStorage.removeItem('token');
        window.location.reload();
      })
      .catch(err => {
        console.error(err);
      })
  }

  render() {
    return (
      <header>
        <Navigation />
        <SearchUsersButton />
        {this.props.isAuthenticated ? <LogoutBtn onClick={this.logout} /> : this.props.isAuthenticated.toString()}
      </header>
    );
  }
};

const Header = connect(mapStateToProps, mapDispatchToProps)(HeaderComponent);

export default Header;
