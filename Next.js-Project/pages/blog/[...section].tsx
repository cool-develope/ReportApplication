import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import Header from "../../components/general/Header";
import Footer from "../../components/general/Footer";
import Sidebar from "../../components/general/SideBar";
import Blog from "../../components/general/Blog";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { withApollo } from "../../lib/apollo";
import { getBaseID, logout } from "../../lib/auth";
import { getTitle } from "../../lib/store";
import Link from "@material-ui/core/Link";

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

const GET_BLOG = gql`
  query getBlog($id: String!) {
    blog(id: $id) {
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

const DELETE_BLOG = gql`
  mutation deleteBlog($id: String!) {
    deleteBlog(id: $id) {
      id
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  mainGrid: {
    marginTop: theme.spacing(1),
  },
  createBlog: {
    marginTop: theme.spacing(5),
    fontSize: "200%",
  },
}));

const BlogPage = () => {
  const classes = useStyles();
  const router = useRouter();

  const [blog, setBlog] = useState({
    id: "",
    title: "",
    section: "",
    avatar: "",
    content: "",
    createAt: "",
    username: "",
  });
  const [update, setUpdate] = useState(0);
  const [title, setTitle] = useState('');

  useEffect(() => {
    setTitle(getTitle(router.query.section[0]));
  });

  const queryBlog = useQuery(GET_BLOG, {
    variables: { id: getBaseID(router.query.section[1]) },
  });

  const queryBlogs = useQuery(GET_BLOGS, {
    variables: { section: router.query.section[0] },
  });

  const [_deleteBlog, { loading, error }] = useMutation(DELETE_BLOG);

  const deleteBlog = (id: string) => {
    console.log(id);
    _deleteBlog({ variables: { id: id } })
      .then((res) => {
        router.push("/");
      })
      .catch((e) => {
        if (e.message.split(":")[1] == " Session expire") {
          logout();
        }
      });
  };
  useEffect(() => {
    if (
      queryBlog.error &&
      queryBlog.error.message.split(":")[1] == " Session expire"
    ) {
      logout();
    }
    if (queryBlogs.data && queryBlogs.data["blogs"]) {
      if (queryBlogs.data["blogs"].length > 0) setUpdate(1);
      if (queryBlog.data && queryBlog.data.blog && queryBlog.data.blog.id) {
        setBlog(queryBlog.data["blog"]);
        setUpdate(2);
      }
    }
  });

  return (
    <React.Fragment>
      <Container maxWidth="lg">
        <Header title={title}  visibleSection={true} />

        {loading && <p>Loading...</p>}
        {error && <p>{error.message.split(":")[1]}</p>}
        {update > 0 ? (
          <Grid container spacing={1} className={classes.mainGrid}>
            {update == 1 ? (
              <Blog
                blog={queryBlogs.data["blogs"][0]}
                deleteBlog={deleteBlog}
              />
            ) : (
              <Blog blog={blog} deleteBlog={deleteBlog} />
            )}
            <Sidebar blogs={queryBlogs.data["blogs"]} />
          </Grid>
        ) : (
          <Grid container justify="center" className={classes.createBlog}>
            <Link href="/update_blog/create">Create Blog</Link>
          </Grid>
        )}
      </Container>
      <Footer />
    </React.Fragment>
  );
};

export default withApollo(BlogPage);
