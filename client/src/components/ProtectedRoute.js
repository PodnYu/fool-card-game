import React from 'react';
import { Route, Redirect } from 'react-router-dom';


export default function ProtectedRoute({ component: Component, ...rest }) {
    console.log('protected route: ', rest);
    return (
        <Route path={rest.path} {...rest} render={
            props => {
                if (rest.auth) {
                    return <Component {...rest} {...props} />
                }
                else {
                    return <Redirect to='login' />
                }
            }
        }>
        </Route>
    );
}