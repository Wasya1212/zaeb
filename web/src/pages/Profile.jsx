import React, { Component } from 'react';

import Auth from '../components/Auth.jsx';

class Profile extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Auth failureRedirect="/sign-in" />
        <span>Profile</span>
      </div>
    );
  }
}

export default Profile;
