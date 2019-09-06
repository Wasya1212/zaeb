import React, { Component } from 'react';

import axios from 'axios';

import { Auth } from '../components/Auth.jsx';
import { UserSettingsButton, UserView } from '../components/Users.jsx';

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {
        info: {
          status: {
            work_times: {},
            work_days: []
          }
        }
      }
    };
  }

  componentDidMount() {
    axios
      .post('/api/user/current-user', {token: localStorage.getItem('token')})
      .then(({data: user}) => {
        this.setState({user});
        console.log()
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
        {this.state.user.info.phone}
        <UserSettingsButton user={this.state.user} />
        <UserView user={this.state.user} />
      </div>
    );
  }
}

export default Profile;
