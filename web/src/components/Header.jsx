import React, { Component } from 'react';
import Modal from 'react-modal';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';

import axios from 'axios';

import { removeAuthentication } from "../actions/index";

import UsersList from "./UsersList.jsx";

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

class SearchUsersButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      findUsersModalIsOpen: false,
      users: []
    };
  }

  closeFindUsersModal = () => {
    this.setState({
      findUsersModalIsOpen: false
    });
  }

  showSearchMenu = () => {
    this.setState({
      findUsersModalIsOpen: true
    });
  }

  findUsers = () => {
    axios
      .post('api/users', { token: localStorage.getItem('token') })
      .then(resolve => {
        console.log(resolve);
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <div>
        <button onClick={this.showSearchMenu}>search users</button>
        <Modal
          isOpen={this.state.findUsersModalIsOpen}
          onRequestClose={this.closeFindUsersModal}
          contentLabel="Find users"
        >
          <UsersList users={this.state.users} />
          <button onClick={this.findUsers}>find users</button>
          <button onClick={this.closeFindUsersModal}>Close modal</button>
        </Modal>
      </div>
    );
  }
}

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
