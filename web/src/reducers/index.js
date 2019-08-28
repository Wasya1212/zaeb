import { ADD_ARTICLE, ADD_TOKEN } from "../constants/action-types";

const initialState = {
  articles: [],
  token: ''
};

function rootReducer(state = initialState, action) {
  if (action.type === ADD_ARTICLE) {
    return Object.assign({}, state, {
      articles: state.articles.concat(action.payload)
    });
  }

  if (action.type === ADD_TOKEN) {
    return Object.assign({}, state, {
      token: action.payload
    });
  }

  return state;
}

export default rootReducer;
