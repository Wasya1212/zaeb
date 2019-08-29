import React, { Component } from 'react';
import { connect } from "react-redux";

import axios from 'axios';

import { addToken, addAuthentication, removeAuthentication } from "../actions/index";

function mapDispatchToProps(dispatch) {
  return {
    addToken: token => dispatch(addToken(token)),
    addAuthentication: () => dispatch(addAuthentication()),
    removeAuthentication: () => dispatch(removeAuthentication())
  };
}

const mapStateToProps = state => {
  return { token: state.token };
};

class RegistrationForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      email: '',
      reEmail: '',
      password: '',
      rePassword: ''
    };
  }

  validateForm() {
    return this.state.username.length > 5 && this.state.email !== '' && this.state.password !== '' && this.state.email === this.state.reEmail && this.state.password === this.state.rePassword;
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit = e => {
    e.preventDefault();

    if (this.validateForm() === true) {
      axios
        .post('/api/auth/sign-up', {
          username: this.state.username,
          email: this.state.email,
          password: this.state.password
        })
        .then(({ data: token }) => {
          localStorage.setItem('token', token);
          this.props.addToken(token);
          this.props.addAuthentication();
        })
        .then(() => {
          try {
            this.props.success();
          } catch (err) {
            console.error(err);
          }
        })
        .catch(err => {
          localStorage.clear();
          this.props.removeAuthentication();
          console.error(err);
        });
    } else {
      alert('incorrect data');
    }
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input
            name="username"
            type="text"
            placeholder="full name"
            onChange={this.handleChange}
            required="required"
          />
          <input
            name="email"
            type="email"
            placeholder="email"
            onChange={this.handleChange}
            required="required"
          />
          <input
            name="reEmail"
            type="email"
            placeholder="retype email"
            onChange={this.handleChange}
            required="required"
          />
          <input
            name="password"
            type="password"
            placeholder="password"
            onChange={this.handleChange}
            required="required"
          />
          <input
            name="rePassword"
            type="password"
            placeholder="retype password"
            onChange={this.handleChange}
            required="required"
          />
          <button type="submit">sign up</button>
        </form>
      </div>
    );
  }
}

const Registration = connect(mapStateToProps, mapDispatchToProps)(RegistrationForm);

export default Registration;
