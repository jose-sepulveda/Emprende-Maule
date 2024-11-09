import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext";


function PrivateRoute({children}){
    const {auth} = React.useContext(AuthContext);
    const location = useLocation();
    return auth.token?(children):<Navigate to = {""} replace state={{path: location.pathname}}></Navigate>
}

export {PrivateRoute};