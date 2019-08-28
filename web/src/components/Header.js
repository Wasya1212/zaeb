import React, { Component } from 'react';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';

import axios from 'axios';

import { addAuthentication } from "../actions/index";

const mapStateToProps = state => {
  return { isAuthenticated: state.isAuthenticated };
};

function mapDispatchToProps(dispatch) {
  return {
    addAuthentication: val => dispatch(addAuthentication(val))
  };
}

const Navigation = () => (
  <nav>
    <li><Link to="sign-in">login</Link></li>
    <li><Link to="sign-up">sign up</Link></li>
    <li><Link to="profile">home</Link></li>
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
      .post('/api/auth/logout')
      .then(() => {
        this.props.addAuthentication(false);
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
        {this.props.isAuthenticated ? <LogoutBtn onClick={this.logout} /> : null}
      </header>
    );
  }
};

const Header = connect(mapStateToProps, mapDispatchToProps)(HeaderComponent);

export default Header;
