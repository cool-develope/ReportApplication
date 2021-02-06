import Router from "next/router";
import fetch from "isomorphic-unfetch";

global.URLSearchParams = URLSearchParams;

export const getToken = () => {
  if (typeof localStorage === "undefined") {
    return "undefined";
  }
  let user = localStorage.getItem("user");
  if (user === null || user === "undefined") return "undefined";

  user = JSON.parse(user);

  if (user && user.token) return user.token;

  return "undefined";
};

const checkToken = async (token) => {
  res = await fetch("http://192.168.0.123:8001/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "token=" + token,
  });
  return res.json();
};

export const isLogin = () => {
  let token = getToken();
  return token !== "undefined";
};

export const getUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export const getUserName = () => {
  if (typeof localStorage === "undefined") {
    return "undefined";
  }
  let user = localStorage.getItem("user");
  if (user === null || user === "undefined") return "undefined";
  return JSON.parse(localStorage.getItem("user"))["username"];
};

export const login = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const logout = async () => {
  localStorage.removeItem("user");
  Router.push("/authentication/login");
};

export const getValidID = (id) => {
  return id.substring(10, id.length - 2);
};

export const getBaseID = (id) => {
  return 'ObjectID("' + id + '")';
};
