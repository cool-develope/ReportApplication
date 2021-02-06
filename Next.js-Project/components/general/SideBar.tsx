import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import FeaturedBlog from "./FeaturedBlog";

const useStyles = makeStyles((theme) => ({
  sidebar: {
    padding: theme.spacing(2),
  },
  sidebarSection: {
    marginTop: theme.spacing(3),
  },
}));
interface MyProps {
  blogs: {
    id: string;
    title: string;
    section: string;
    avatar: string;
    content: string;
    createAt: string;
    username: string;
  }[];
}
export default function Sidebar(props: React.PropsWithChildren<MyProps>) {
  const classes = useStyles();
  const { blogs } = props;

  return (
    <Grid item xs={12} md={3} className={classes.sidebar}>
      {blogs.map((blog) => (
        <FeaturedBlog blog={blog} />
      ))}
    </Grid>
  );
}
