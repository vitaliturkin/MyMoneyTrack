import React, { useState, useEffect } from "react";
import { Link , useLocation} from "react-router-dom";
import AuthService from "../services/AuthService";
import Balance from "./Balance";

const Sidebar = () => {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
    const [userName, setUserName] = useState("Guest");

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo") || '{}');
        if (userInfo?.name) {
            setUserName(`${userInfo.name} ${userInfo.lastName || ''}`);
        }
    }, []);

    const isActive = (path) => location.pathname === path;

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
        document.body.classList.toggle("sidebar-open");
    };

    const handleLogout = () => {
        AuthService.removeAuthInfo();
        window.location.href = "/login"; // redirecting to login
    };

    return (
        <div>
            <button className="btn d-lg-none burger-btn position-fixed top-0 start-0 m-3" onClick={() => {
                document.querySelector('.sidebar').classList.toggle('open');
            }}>
                &#9776;
            </button>
            <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
                <Link to="/" className="sidebar-logo text-decoration-none my-link-js">
                    <img className="my-link-img-js w-75" src="/images/logo.png" alt="Logo" />
                </Link>
                <div className="sidebar-content d-flex flex-column justify-content-between">
                    <ul className="sidebar-nav nav nav-pills flex-column">
                        <li className="nav-item">
                            <Link to="/" className={`nav-link my-link-js ${isActive("/") ? "active" : ""}`}>Dashboard</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/incomesAndExpenses" className={`nav-link my-link-js ${isActive("/incomesAndExpenses") ? "active" : ""}`}>Income & Expenses</Link>
                        </li>

                        {/* Categories Dropdown */}
                        <li className="accordion accordion-flush" id="accordionFlushExample">
                            <div className="accordion-item">
                                <h2 className="accordion-header">
                                    <button className="accordion-button nav-link collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne">
                                        Categories
                                    </button>
                                </h2>
                                <div id="flush-collapseOne" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                                    <div className="accordion-body">
                                        <ul className="list-unstyled">
                                            <li className="nav-item">
                                                <Link className={`nav-link my-link-js ${isActive("/income") ? "active" : ""}`} to="/income">Income</Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link className={`nav-link my-link-js ${isActive("/expense") ? "active" : ""}`} to="/expense">Expenses</Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>

                    {/* passing modal state to Balance */}
                    <Balance
                        isBalanceModalOpen={isBalanceModalOpen}
                        setIsBalanceModalOpen={setIsBalanceModalOpen}
                    />
                </div>

                {/* User Info & Logout */}
                <div className="btn-group dropup">
                    <button type="button" className="btn user-btn dropdown-toggle"
                            data-bs-toggle="dropdown" aria-expanded="false">
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none">
                            <circle cx="18" cy="18" r="18" fill="#D9D9D9"/>
                            <path d="M18 18C19.0609 18 20.0783 17.5786 20.8284 16.8284C21.5786 16.0783 22 15.0609 22 14C22 12.9391 21.5786 11.9217 20.8284 11.1716C20.0783 10.4214 19.0609 10 18 10C16.9391 10 15.9217 10.4214 15.1716 11.1716C14.4214 11.9217 14 12.9391 14 14C14 15.0609 14.4214 16.0783 15.1716 16.8284C15.9217 17.5786 16.9391 18 18 18ZM20.6667 14C20.6667 14.7072 20.3857 15.3855 19.8856 15.8856C19.3855 16.3857 18.7072 16.6667 18 16.6667C17.2928 16.6667 16.6145 16.3857 16.1144 15.8856C15.6143 15.3855 15.3333 14.7072 15.3333 14C15.3333 13.2928 15.6143 12.6145 16.1144 12.1144C16.6145 11.6143 17.2928 11.3333 18 11.3333C18.7072 11.3333 19.3855 11.6143 19.8856 12.1144C20.3857 12.6145 20.6667 13.2928 20.6667 14ZM26 24.6667C26 26 24.6667 26 24.6667 26H11.3333C11.3333 26 10 26 10 24.6667C10 23.3333 11.3333 19.3333 18 19.3333C24.6667 19.3333 26 23.3333 26 24.6667ZM24.6667 24.6613C24.6653 24.3333 24.4613 23.3467 23.5573 22.4427C22.688 21.5733 21.052 20.6667 18 20.6667C14.9467 20.6667 13.312 21.5733 12.4427 22.4427C11.5387 23.3467 11.336 24.3333 11.3333 24.6613H24.6667Z"
                                  fill="#6C757D"/>
                        </svg>
                        {userName}
                    </button>
                    <ul className="dropdown-menu w-100">
                        <li><a className="dropdown-item" href="#" onClick={handleLogout}>Logout</a></li>
                    </ul>
                </div>
            </aside>
        </div>
    );
};

export default Sidebar;
