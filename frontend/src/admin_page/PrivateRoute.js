/**
 * @author Xi Pu
 * A wrapper function that returns a React route object that will display the admin page when the user is authenticated.
 * If the user is not authenticated, it will redirect the user to the /adminLogin page.
 */

import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import Admin from "./Admin";

const PrivateRoute = () => {
    return (
        // Show the component only when the user is logged in
        // Otherwise, redirect the user to /adminLogin page
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
