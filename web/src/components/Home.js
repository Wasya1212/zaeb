import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
// import axios from 'axios';
import { connect } from "react-redux";
import { addArticle } from "../actions/index";

const mapStateToProps = state => {
  return { articles: state.articles };
};

function mapDispatchToProps(dispatch) {
  return {
    addArticle: article => dispatch(addArticle(article))
  };
}

const ConnectedList = ({ articles }) => (
  <ul className="list-group list-group-flush">
    <div>home</div>
    {articles.map(el => (
      <li className="list-group-item" key={el.id}>
        {el.title}
      </li>
    ))}
  </ul>
);

const ArticlesList = connect(mapStateToProps)(ConnectedList);

class HomeForm extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.addArticle({ title: 'title', id: 'id' + Date.now() });
  }

  render() {
    return (
      <div>
        <div>home</div>
        <ArticlesList />
      </div>
    );
  }
}

const Home = connect(null, mapDispatchToProps)(HomeForm);

export default Home;
