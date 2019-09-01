import React, { Component } from 'react';

const UserView = ({user}) => (
  <div>
    {user.email}
  </div>
);

const UsersList = props => (
  <ul>
    {props.users.map(user => (<li><UserView user={user}/></li>))}
  </ul>
);

export default UsersList;
