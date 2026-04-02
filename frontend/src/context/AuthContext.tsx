import { createContext, useContext, useState, useEffect } from "react";

type AuthContextType = {
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    isLoading: boolean;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    // Check auth on mount (placeholder for token check)
    useEffect(() => {
        const checkAuth = async () => {
            try {
                // TODO: Replace with actual API call or localStorage check
                // const token = localStorage.getItem("authToken");
                // const isValid = await verifyToken(token);
                // setIsAuthenticated(isValid);
                // setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const logout = () => {
        setIsAuthenticated(false);
        // TODO: Clear token from localStorage/cookie
    };

    const values = {
        isAuthenticated,
        setIsAuthenticated,
        isLoading,
        logout,
    };

    return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const UserAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("UserAuth must be used within AuthContextProvider");
    return ctx;
};