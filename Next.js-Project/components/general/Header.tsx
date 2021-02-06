import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import { CardMedia } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import { isLogin, getUserName, logout } from "../../lib/auth";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { sections } from "../../lib/store";

const useStyles = makeStyles((theme) => ({
  toolbar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbarTitle: {
    flex: 1,
  },
  toolbarSecondary: {
    justifyContent: "space-between",
    overflowX: "auto",
  },
  toolbarLink: {
    padding: theme.spacing(1),
    flexShrink: 0,
  },
  button: {
    margin: theme.spacing(1),
  },
  imageCard: {
    width: "150px",
    height: "65px",
  },
}));

interface MyProps {
  title: string;
  visibleSection: boolean;
}

const LOGOUT_USER = gql`
  mutation loginUser($username: String!) {
    logoutUser(input: { username: $username }) {
      username
      token
    }
  }
`;

export default function Header(props: React.PropsWithChildren<MyProps>) {
  const classes = useStyles();
  const { title, visibleSection } = props;

  const [_logout, { loading, error }] = useMutation(LOGOUT_USER);

  const handleLogout = () => {
    const username = getUserName();
    _logout({
      variables: { username },
    })
      .then((res) => {
        logout();
      })
      .catch((e) => console.log(e.message));
  };

  return (
    <React.Fragment>
      <Toolbar className={classes.toolbar}>
        <Link href="/">
          <CardMedia
            component="img"
            src="/static/logo.png"
            className={classes.imageCard}
          />
        </Link>
        {/* <Button size="small">Subscribe</Button> */}
        <Typography
          component="h2"
          variant="h5"
          color="inherit"
          align="center"
          noWrap
          className={classes.toolbarTitle}
        >
          {title}
        </Typography>
        {isLogin() ? (
          <div>
            <Button variant="text" onClick={handleLogout}>
              <i>{getUserName()}</i>
              <b>&nbsp;&nbsp;Logout</b>
            </Button>
          </div>
        ) : (
          <div>
            <Button variant="outlined" size="small" className={classes.button}>
              <Link href="/authentication/login">Sign in</Link>
            </Button>
            <Button variant="outlined" size="small" className={classes.button}>
              <Link href="/authentication/signup">Sign up</Link>
            </Button>
          </div>
        )}
      </Toolbar>
      {isLogin() && sections.length > 0 && visibleSection && (
        <Toolbar
          component="nav"
          variant="dense"
          className={classes.toolbarSecondary}
        >
          {sections.map((section) => (
            <Link
              color="inherit"
              noWrap
              key={section.title}
              variant="body2"
              href={"/blog/" + section.url}
              className={classes.toolbarLink}
            >
              {section.title}
            </Link>
          ))}
        </Toolbar>
      )}
    </React.Fragment>
  );
}
