import {
  ADD_ARTICLE,
  ADD_TOKEN,
  ADD_AUTHENTICATION,
  REMOVE_AUTHENTICATION
} from "../constants/action-types";

const initialState = {
  articles: [],
  token: localStorage.getItem('token') || '',
  isAuthenticated: false
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

  if (action.type === ADD_AUTHENTICATION) {
    console.log('add auth')
    return Object.assign({}, state, {
      isAuthenticated: true
    });
  }

  if (action.type === REMOVE_AUTHENTICATION) {
    console.log('remove auth')
    return Object.assign({}, state, {
      isAuthenticated: false
    });
  }

  return state;
}

export default rootReducer;
