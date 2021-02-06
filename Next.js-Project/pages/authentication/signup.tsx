import React from "react";
import SignUp from "../../components/auth/SignUp";
import { useMutation } from "@apollo/react-hooks";
import { withApollo } from "../../lib/apollo";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import gql from "graphql-tag";
import { login } from "../../lib/auth";
import { useRouter } from "next/router";

const REGISTER_USER = gql`
  mutation registerUser(
    $username: String!
    $email: String!
    $password: String!
  ) {
    registerUser(
      input: { username: $username, email: $email, password: $password }
    ) {
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

function Signup() {
  const classes = useStyles();
  const [_register, { loading, error }] = useMutation(REGISTER_USER);
  const router = useRouter();

  const handleRegister = (
    username: string,
    email: string,
    password: string
  ) => {
    _register({
      variables: { username, email, password },
    })
      .then((res) => {
        console.log(res);
        login(res["data"]["registerUser"]);
        router.push("/");
      })
      .catch((e) => console.log(e.message));
  };

  return (
    <Grid>
      <Grid className={classes.image} />
      <SignUp handleRegister={handleRegister}>
        {loading && <p>Loading...</p>}
        {error && <p>{error.message.split(":")[1]}</p>}
      </SignUp>
    </Grid>
  );
}

export default withApollo(Signup);
