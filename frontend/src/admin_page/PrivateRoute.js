import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import Admin from "./Admin";

const PrivateRoute = () => {
    return (
        // Show the component only when the user is logged in
        // Otherwise, redirect the user to /signin page
        <Route render={(props) => {
            if (props.location.isAuthenticated) {
                return (<Admin/>);
            } else {
                return (<Redirect to="/adminLogin"/>);
            }
        }}/>
    );
};

export default PrivateRoute;
