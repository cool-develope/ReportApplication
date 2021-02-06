import React, { useState } from "react";
import Showdown from "showdown";
import {
  TextField,
  Grid,
  Container,
  FormControl,
  InputLabel,
  Select,
  Button,
} from "@material-ui/core";
import dynamic from "next/dynamic";
import Header from "./Header";
import { makeStyles } from "@material-ui/core/styles";
import SaveIcon from "@material-ui/icons/Save";

const CodeWithCodemirror = dynamic(import("./CodeMirror"), { ssr: false });

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
  simpleLineBreaks: true,
});

const useStyles = makeStyles((theme) => ({
  codemirror: {
    minHeight: "800px",
  },
  previewer: {
    margin: "5px 5px 5px 5px",
    backgroundColor: "#f3f3f3",
    height: "800px",
    overflowX: "auto",
    fontSize: "120%",
  },
  editor: {
    padding: "5px 5px 5px 5px",
  },
  formControl: {
    marginLeft: theme.spacing(1),
    minWidth: 120,
    width: "20%",
  },
  button: {
    margin: theme.spacing(1),
  },
  title: {
    width: "30%",
    marginRight: "10px",
  },
  avatar: {
    width: "30%",
    marginRight: "5px",
  },
}));

interface MyProps {
  sections: { title: string; url: string }[];
  editBlog: {
    id: string;
    title: string;
    section: string;
    content: string;
    avatar: string;
  };
  updateBlog: (
    id: string,
    title: string,
    section: string,
    avatar: string,
    content: string
  ) => void;
}

export default function App(props: React.PropsWithChildren<MyProps>) {
  const { sections, editBlog, updateBlog } = props;

  const [blog, setBlog] = useState({
    id: editBlog.id,
    title: editBlog.title,
    section: editBlog.section,
    content: editBlog.content,
    avatar: editBlog.avatar,
  });
  const classes = useStyles();

  const handleSave = () => {
    console.log("simple id = " + blog.id);
    updateBlog(blog.id, blog.title, blog.section, blog.avatar, blog.content);
  };
  return (
    <React.Fragment>
      <Container maxWidth="lg">
        <TextField
          className={classes.title}
          id="standard-basic"
          label="Title"
          value={blog.title}
          onChange={(event) => {
            setBlog({ ...blog, title: String(event.target.value) });
          }}
        />

        <TextField
          className={classes.avatar}
          id="standard-basic"
          label="Avatar"
          value={blog.avatar}
          onChange={(event) => {
            setBlog({ ...blog, avatar: String(event.target.value) });
          }}
        />

        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="age-native-simple">Section</InputLabel>
          <Select
            native
            value={blog.section}
            onChange={(event) => {
              setBlog({ ...blog, section: String(event.target.value) });
            }}
            inputProps={{
              name: "age",
              id: "age-native-simple",
            }}
          >
            <option aria-label="None" value="" />
            {sections.map((section) => (
              <option value={section.url}>{section.title}</option>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          size="large"
          className={classes.button}
          startIcon={<SaveIcon />}
          onClick={(event) => {
            handleSave();
          }}
        >
          Save
        </Button>
      </Container>

      <Grid container>
        <Grid item xs={6} className={classes.editor}>
          <CodeWithCodemirror
            className={classes.codemirror}
            value={blog.content}
            onChange={(text) => {
              setBlog({ ...blog, content: text });
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <div
            className={classes.previewer}
            dangerouslySetInnerHTML={{
              __html: converter.makeHtml(blog.content),
            }}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
