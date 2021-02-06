import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Hidden from "@material-ui/core/Hidden";
import Link from "@material-ui/core/Link";
import { getValidID } from "../../lib/auth";

const useStyles = makeStyles((theme) => ({
  card: {
    display: "flex",
  },
  cardDetails: {
    flex: 1,
  },
  cardMedia: {
    height: 150,
  },
  blog: {
    marginBottom: theme.spacing(3),
  },
}));

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
}

export default function FeaturedBlog(props: React.PropsWithChildren<MyProps>) {
  const classes = useStyles();
  const { blog } = props;

  return (
    <Grid item>
      <CardActionArea
        component="a"
        href={"/blog/" + blog.section + "/" + getValidID(blog.id)}
        className={classes.blog}
      >
        <CardMedia
          className={classes.cardMedia}
          image={decodeURIComponent(blog.avatar)}
          title={blog.title}
        />
        <Card className={classes.card}>
          <div className={classes.cardDetails}>
            <CardContent>
              <Typography component="h2" variant="h5">
                {blog.title}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Created by <b>{blog.username}</b> at{" "}
                {blog.createAt.substring(0, 10)}
              </Typography>
            </CardContent>
          </div>
        </Card>
      </CardActionArea>
    </Grid>
  );
}
