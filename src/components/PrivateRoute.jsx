import React from "react";
import { Container, Loader } from "rsuite";
import { Route, Redirect } from "react-router";
import { useProfile } from "../context/profile.context";

const PrivateRoute = ({ children, ...routeProps }) => {
  const { profile, isLoading } = useProfile();
  if (isLoading && !profile) {
    return (
      <Container>
        <Loader center vertical size="md" content="Loading" speed="low" />
      </Container>
    );
  }

  //   if user is not logged in
  if (!profile && !isLoading) {
    return <Redirect to="/signin" />;
  }

  return <Route {...routeProps}>{children}</Route>;
};

export default PrivateRoute;
