import React, { createContext, useContext, useState, useCallback } from "react";
import config from "../config/config";

const BalanceContext = createContext();

export const BalanceProvider = ({ children }) => {
    const [balance, setBalance] = useState(0);

    const fetchBalance = useCallback(async () => {
        try {
            const token = localStorage.getItem("accessToken");

            const res = await fetch(`${config.host}/api/balance`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": token
                }
            });

            const data = await res.json();
            if (res.ok && data.balance !== undefined) {
                setBalance(data.balance);
            }
        } catch (error) {
            console.error("Error fetching balance:", error);
        }
    }, []);

    return (
        <BalanceContext.Provider value={{ balance, fetchBalance }}>
            {children}
        </BalanceContext.Provider>
    );
};

export const useBalanceContext = () => useContext(BalanceContext);
