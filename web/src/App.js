import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from "react-redux";
import { addToken } from "./actions/index";
import './App.css';
import Home from './components/Home';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

function mapDispatchToProps(dispatch) {
  return {
    addToken: token => dispatch(addToken(token))
  };
}

const mapStateToProps = state => {
  return { token: state.token };
};

class AppComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: false
    };
  }

  setRedirect = () => {
    this.setState({
      redirect: true
    })
  }

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to='/login' />
    }
  }

  componentDidMount() {
    // this.props.addToken({ val: 'tokens', id: 'id' + Date.now() });
    console.log(this.props)
    if (this.props.token.val === '' || !this.props.token) {
      this.setState({ redirect: true });
    }
  }

  render() {
    return (
      <div>
        {this.renderRedirect()}
        <span>{this.props.token.val}</span>
        <Home />
      </div>
    );
  }
}

const App = connect(mapStateToProps, mapDispatchToProps)(AppComponent);

// function App() {
//   return (
//     <Home />
//   );
// }

export default App;
