import React, { useEffect, useState } from "react";
import axios from "axios";
import { useBalanceContext } from "../services/BalanceContext";
import config from "../config/config";

const Balance = ({ isBalanceModalOpen, setIsBalanceModalOpen }) => {
    const { balance, fetchBalance } = useBalanceContext();
    const [newBalance, setNewBalance] = useState("");
    const [currency, setCurrency] = useState("GBP");
    const [exchangeRates, setExchangeRates] = useState({});
    const [currencies, setCurrencies] = useState([]);

    const API_KEY = "de0fa05654ca37383a9f7ea7";
    const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/GBP`;

    useEffect(() => {
        axios.get(API_URL)
            .then(response => {
                setExchangeRates(response.data.conversion_rates);
                setCurrencies(Object.keys(response.data.conversion_rates));
            })
            .catch(error => console.error("Error fetching exchange rates:", error));
    }, []);

    useEffect(() => {
        fetchBalance(); // automatically fetch when component mounts
    }, [fetchBalance]);

    const updateBalance = async () => {
        if (isNaN(parseFloat(newBalance))) return;
        try {
            const token = localStorage.getItem("accessToken");

            await fetch(`${config.host}/api/balance`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", "x-auth-token": token },
                body: JSON.stringify({ balance: parseFloat(newBalance) })
            });

            await fetchBalance();
            setIsBalanceModalOpen(false);
        } catch (error) {
            console.error("Error updating balance:", error);
        }
    };

    return (
        <div className="balance-container">
            <p onClick={() => setIsBalanceModalOpen(true)} className="ms-3">
                Balance: <span className="cash text-primary fw-bold cursor-pointer">
                    {(balance * (exchangeRates[currency] || 1)).toFixed(2)} {currency}
                </span>
            </p>
            <select className="form-select mt-2 ms-3 w-50" value={currency}
                    onChange={(e) => setCurrency(e.target.value)}>
                {currencies.map((curr) => (
                    <option key={curr} value={curr}>{curr}</option>
                ))}
            </select>

            {isBalanceModalOpen && (
                <div id="popup" className="popup-overlay" onClick={() => setIsBalanceModalOpen(false)}>
                    <div className="popup-block popup-active flex flex-column flex-nowrap" onClick={(e) => e.stopPropagation()}>
                        <h2 className="popup-text">Update Balance</h2>
                        <input placeholder="£" className="mb-2" type="number" value={newBalance} onChange={(e) => setNewBalance(e.target.value)} />
                        <button className="main-page-item-options-edit btn btn-success me-2" onClick={updateBalance}>
                            Save
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Balance;
