import {
  ADD_ARTICLE,
  ADD_TOKEN
} from "../constants/action-types";

export function addArticle(payload) {
  return { type: ADD_ARTICLE, payload };
}

export function addToken(payload) {
  return { type: ADD_TOKEN, payload };
}
