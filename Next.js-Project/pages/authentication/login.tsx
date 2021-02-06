import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/react-hooks";
import { withApollo } from "../../lib/apollo";
import SignIn from "../../components/auth/SignIn";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import gql from "graphql-tag";
import { login, isLogin } from "../../lib/auth";
import Router, { useRouter } from "next/router";

const LOGIN_USER = gql`
  mutation loginUser($username: String!, $password: String!) {
    loginUser(input: { username: $username, password: $password }) {
      username
      token
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  image: {
    backgroundImage: "url(https://source.unsplash.com/random)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "dark"
        ? theme.palette.grey[900]
        : theme.palette.grey[50],
    backgroundSize: "cover",
    height: "100vh",
    filter: `blur(7px)`,
  },
}));

function Login() {
  const router = useRouter();

  if (isLogin()) {
    router.push("/", undefined, { shallow: true });
  }

  const [_login, { loading, error }] = useMutation(LOGIN_USER);

  const handleLogin = (username: string, password: string) => {
    _login({
      variables: { username, password },
    })
      .then((res) => {
        login(res["data"]["loginUser"]);
        router.push("/");
      })
      .catch((e) => console.log(e.message));
  };

  const classes = useStyles();
  return (
    <Grid>
      <Grid className={classes.image} />
      <SignIn handleLogin={handleLogin}>
        {loading && <p>Loading...</p>}
        {error && <p>{error.message.split(":")[1]}</p>}
      </SignIn>
    </Grid>
  );
}

export default withApollo(Login);
