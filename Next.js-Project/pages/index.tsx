import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import Typography from "@material-ui/core/Typography";
import Link from "../components/general/Link";
import { withApollo } from "../lib/apollo";
import { logout, isLogin } from "../lib/auth";
import Footer from "../components/general/Footer";
import Header from "../components/general/Header";

import { makeStyles } from "@material-ui/core/styles";
import Sidebar from "../components/general/SideBar";
import Blog from "../components/general/Blog";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { CssBaseline } from "@material-ui/core";

const GET_BLOGS = gql`
  query getBlogs($section: String!) {
    blogs(section: $section) {
      id
      title
      section
      avatar
      content
      createAt
      username
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  mainGrid: {
    marginTop: theme.spacing(3),
  },
}));

function Index() {
  const router = useRouter();
  const classes = useStyles();
  const [update, setUpdate] = useState(false);

  const { loading, error, data } = useQuery(GET_BLOGS, {
    variables: { section: "news" },
  });

  useEffect(() => {
    if (data && data["blogs"]) {
      if (data["blogs"].length > 0) setUpdate(true);
    }
  });

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg">
        <Header title="MemoNote" visibleSection={true} />
        {loading && <p>Loading...</p>}
        {error && <p>{error.message.split(":")[1]}</p>}
        {update && (
          <Grid container spacing={1} className={classes.mainGrid}>
            <Sidebar blogs={data["blogs"]} />
          </Grid>
        )}
      </Container>
      <Footer />
    </React.Fragment>
  );
}

export default withApollo(Index);
