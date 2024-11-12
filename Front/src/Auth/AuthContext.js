import { jwtDecode } from 'jwt-decode';
import { createContext, useEffect, useState } from "react";


export const AuthContext = createContext();

export function AuthProvider({children}) {
    const [auth, setAuth] = useState({ token: null, role: null, id: null});
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decodedToken = jwtDecode(token);
            const { exp, role, id_emprendedor, id_cliente, id_administrador} = decodedToken;
            const id = id_emprendedor || id_cliente || id_administrador;

            if (!id) {
                console.error("Token no contiene un ID válido");
                return;
            }
            setAuth({ token, role, id });
        }
    }, []);

    const setToken = (token) => {
        const decodedToken = jwtDecode(token);
        const { role, id_emprendedor, id_cliente, id_administrador } = decodedToken;
        const id = id_emprendedor ?? id_cliente ?? id_administrador;
        if (id === null || id === undefined) {
            console.error("Token no contiene un ID válido");
            return;
        }
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("id", id);
        setAuth({ token, role, id });
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("id");
        setAuth( { token: null, role: null, id: null});
    };

    return (
        <AuthContext.Provider value={{auth, setToken, logout}}>
            {children}
        </AuthContext.Provider>
    )
}