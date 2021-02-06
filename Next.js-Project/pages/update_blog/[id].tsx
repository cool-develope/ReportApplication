import React, { useState, useEffect } from "react";
import Container from "@material-ui/core/Container";
import SimpleMDE from "../../components/general/SimpleMDE";
import Header from "../../components/general/Header";
import Footer from "../../components/general/Footer";
import { withApollo } from "../../lib/apollo";
import { sections } from "../../lib/store";
import { useRouter } from "next/router";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { logout, getUserName, getValidID, getBaseID } from "../../lib/auth";

const GET_BLOG = gql`
  query getBlog($id: String!) {
    blog(id: $id) {
      id
      title
      section
      avatar
      content
    }
  }
`;

const UPDATE_BLOG = gql`
  mutation updateBlog(
    $id: ID!
    $title: String!
    $section: String!
    $avatar: String!
    $content: String!
    $username: String!
  ) {
    updateBlog(
      input: {
        id: $id
        title: $title
        section: $section
        avatar: $avatar
        content: $content
        username: $username
      }
    ) {
      id
    }
  }
`;

function UpdateBlog() {
  const router = useRouter();
  const { _id } = router.query;

  const [blog, setBlog] = useState({
    id: "",
    title: "",
    section: "",
    avatar: "",
    content: "",
  });

  const [_updateBlog, { loading, error }] = useMutation(UPDATE_BLOG);

  const queryBlog = useQuery(GET_BLOG, {
    variables: { id: getBaseID(router.query.id) },
  });

  const [title, setTitle] = useState("Create Blog");
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    if (
      queryBlog.error &&
      queryBlog.error.message.split(":")[1] == " Session expire"
    ) {
      logout();
    }

    if (queryBlog.data) {
      const blogData = queryBlog.data.blog;
      setBlog(blogData);
      if (blogData.id === undefined || blogData.id === "")
        setBlog({ ...blog, id: "create" });
      else setTitle("Update Blog");
      setUpdate(true);
    }
  }, [queryBlog]);

  const updateBlog = (
    id: string,
    title: string,
    section: string,
    avatar: string,
    content: string
  ) => {
    const username = getUserName();
    if (id == "") id = "create";
    _updateBlog({
      variables: { id, title, section, avatar, content, username },
    })
      .then((res) => {
        router.push(
          "/blog/" + section + "/" + getValidID(res.data?.updateBlog?.id)
        );
      })
      .catch((e) => console.log(e.message));
  };

  return (
    <React.Fragment>
      <Container maxWidth="lg">
        <Header title={title} visibleSection={false} />
      </Container>
      {loading && <p>Loading...</p>}
      {error && _id !== "create" && <p>{error.message.split(":")[1]}</p>}
      {update && (
        <SimpleMDE
          sections={sections}
          editBlog={blog}
          updateBlog={updateBlog}
        />
      )}
      <Footer />
    </React.Fragment>
  );
}

export default withApollo(UpdateBlog);
