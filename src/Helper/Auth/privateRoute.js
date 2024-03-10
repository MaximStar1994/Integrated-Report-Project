import React from "react";
import { Route } from "react-router-dom";
import { Redirect } from "react-router";
import { useAuth } from "./auth";
function PrivateRoute({ component: Component, ...rest }) {
    const { user, setUser } = useAuth();
    if (user.loading) {
        return null
    }
    return (
        <Route
            {...rest}
            render={props =>
                user.isAuthenticated ? (
                    <Component {...props} />
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: { referrer: window.location.pathname }
                        }}
                    />
                )
            }
        />
    );
}

export default PrivateRoute;
