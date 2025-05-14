import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import AuthService from '../services/AuthService';

// this layout displays the sidebar on the left and the main content on the right.
function MainLayout() {
    if (!AuthService.isLoggedIn()) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="d-flex">
            {/* Sidebar */}
            <Sidebar />

            {/* main content area */}
            <div className="flex-fill">
                <Outlet />
            </div>
        </div>
    );
}

export default MainLayout;
