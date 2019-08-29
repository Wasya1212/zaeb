import {
  ADD_ARTICLE,
  ADD_TOKEN,
  ADD_AUTHENTICATION,
  REMOVE_AUTHENTICATION
} from "../constants/action-types";

export function addArticle(payload) {
  return { type: ADD_ARTICLE, payload };
}

export function addToken(payload) {
  return { type: ADD_TOKEN, payload };
}

export function addAuthentication() {
  return { type: ADD_AUTHENTICATION };
}

export function removeAuthentication() {
  return { type: REMOVE_AUTHENTICATION };
}
