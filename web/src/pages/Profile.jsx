import React, { Component } from 'react';

import axios from 'axios';

import { Auth } from '../components/Auth.jsx';
import { UserSettingsButton } from '../components/Users.jsx';

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {}
    };
  }

  componentDidMount() {
    axios
      .post('/api/user/current-user', {token: localStorage.getItem('token')})
      .then(({data: user}) => {
        this.setState({user});
      })
      .catch(err => {
        console.error(err);
      });
  }

  render() {
    return (
      <div>
        <Auth failureRedirect="/sign-in" />
        <span>Profile</span>
        <UserSettingsButton user={this.state.user} />
      </div>
    );
  }
}

export default Profile;
