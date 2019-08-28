import {
  ADD_ARTICLE,
  ADD_TOKEN,
  ADD_AUTHENTICATION
} from "../constants/action-types";

export function addArticle(payload) {
  return { type: ADD_ARTICLE, payload };
}

export function addToken(payload) {
  return { type: ADD_TOKEN, payload };
}

export function addAuthentication(payload) {
  return { type: ADD_AUTHENTICATION, payload };
}
