import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { withStyles } from "@material-ui/core/styles";
import Link from "@material-ui/core/Link";
import Showdown from "showdown";
import { getUserName, isLogin, getValidID } from "../../lib/auth";
const useStyles = makeStyles((theme) => ({
  previewer: {
    margin: "5px 5px 5px 5px",
    backgroundColor: "#f3f3f3",
    overflowX: "auto",
    fontSize: "90%",
  },
  username: {
    fontSize: "150%",
  },
  blogLink: {
    float: "right",
  },
  title: {
    fontSize: "200%",
  },
}));

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
  simpleLineBreaks: true,
});

interface MyProps {
  blog: {
    id: string;
    title: string;
    section: string;
    content: string;
    avatar: string;
    createAt: string;
    username: string;
  };
  deleteBlog: (id: string) => void;
}

export default function Blog(props: React.PropsWithChildren<MyProps>) {
  const classes = useStyles();
  const { blog, deleteBlog } = props;

  return (
    <Grid item xs={12} md={9}>
      <Typography gutterBottom>
        <b className={classes.title}>{blog.title}</b>
        {isLogin() && (
          <Link className={classes.blogLink} href="/update_blog/create">
            Create Blog
          </Link>
        )}
        {getUserName() === blog.username && (
          <Link
            className={classes.blogLink}
            href={"/update_blog/" + getValidID(blog.id)}
          >
            Update Blog /
          </Link>
        )}
        {getUserName() === blog.username && (
          <Link
            className={classes.blogLink}
            onClick={() => {
              deleteBlog(blog.id);
            }}
          >
            Delete Blog /
          </Link>
        )}
      </Typography>
      <p>
        Created at {blog.createAt} by{" "}
        <b className={classes.username}>{blog.username}</b>
      </p>
      <Divider />

      <div
        className={classes.previewer}
        dangerouslySetInnerHTML={{
          __html: converter.makeHtml(blog.content),
        }}
      />
    </Grid>
  );
}
