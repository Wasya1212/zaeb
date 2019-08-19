import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

const Header = () => (
  <nav>
    <li><Link to="login">login</Link></li>
    <li><Link to="sign-up">sign up</Link></li>
    <li><Link to="home">home</Link></li>
  </nav>
);

export default Header
