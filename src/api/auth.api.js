import API from "./axios";

export const loginUser = (credentials) =>
  API.post("token/", credentials);

export const refreshToken = (refresh) =>
  API.post("token/refresh/", { refresh });