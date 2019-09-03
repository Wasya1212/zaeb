import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect } from 'react-router-dom';

import { addAuthentication, removeAuthentication } from "../actions/index";

import axios from 'axios';

function mapDispatchToProps(dispatch) {
  return {
    addAuthentication: () => dispatch(addAuthentication()),
    removeAuthentication: () => dispatch(removeAuthentication())
  };
}

class LogoutComponent extends Component {
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
      <span {...this.props} onClick={this.logout}>{this.props.children || 'logout'}</span>
    )
  }
}

class AuthComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: null
    };
  }

  componentDidMount() {
    const token = localStorage.getItem('token') || '';

    if (!token || token === '') {
      console.error('No auth data is found!');

      if (this.props.failureRedirect) {
        this.setState({
          redirect: <Redirect to={this.props.failureRedirect} />
        });
      }
    } else {
      axios
        .post('/api/auth/authorization', {token})
        .then(() => {
          if (this.props.successRedirect) {
            this.setState({
              redirect: <Redirect to={this.props.successRedirect} />
            });
          }

          this.props.addAuthentication();
        })
        .catch(err => {
          if (this.props.failureRedirect) {
            this.setState({
              redirect: <Redirect to={this.props.failureRedirect} />
            });
          }

          this.props.removeAuthentication();

          console.error('Failure authentication!');
        });
    }
  }

  render() {
    return (
      <div className="Auth">{this.state.redirect}</div>
    );
  }
}

const Auth = connect(null, mapDispatchToProps)(AuthComponent);
const LogoutBtn = connect(null, mapDispatchToProps)(LogoutComponent);

export {Auth, LogoutBtn};
