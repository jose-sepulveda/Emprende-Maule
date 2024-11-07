import { jwtDecode } from 'jwt-decode';
import { createContext, useEffect, useState } from "react";


export const AuthContext = createContext();

export function AuthProvider({children}) {
    const [auth, setAuth] = useState({ token: null, role: null, correo: null});

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decodedToken = jwtDecode(token);
            const { role, sub: correo } = decodedToken;
            setAuth({ token, role, correo});
        }
    }, []);

    const setToken = (token) => {
        const decodedToken = jwtDecode(token);
        const { role, sub: correo } = decodedToken;
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("correo", correo);
        setAuth({ token, role, correo });
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("username");
        setAuth( { token: null, role: null, correo: null});
    };

    return (
        <AuthContext.Provider value={{auth, setToken, logout}}>
            {children}
        </AuthContext.Provider>
    )
}