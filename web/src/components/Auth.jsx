import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect } from 'react-router-dom';

import { addAuthentication } from "../actions/index";

import axios from 'axios';

function mapDispatchToProps(dispatch) {
  return {
    addAuthentication: val => dispatch(addAuthentication(val))
  };
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

    axios
      .post('/api/auth/authorization', {token})
      .then(() => {
        if (this.props.successRedirect) {
          this.setState({
            redirect: <Redirect to={this.props.successRedirect} />
          });
          this.props.addAuthentication(true);
        }
      })
      .catch(err => {
        if (this.props.failureRedirect) {
          this.setState({
            redirect: <Redirect to={this.props.failureRedirect} />
          });
          this.props.addAuthentication(false);
        }

        console.error('Failure authentication!');
      });
  }

  render() {
    return (
      <div className="Auth">{this.state.redirect}</div>
    );
  }
}

const Auth = connect(null, mapDispatchToProps)(AuthComponent);

export default Auth;
