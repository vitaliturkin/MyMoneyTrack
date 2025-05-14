import React from 'react';
import { Outlet } from 'react-router-dom';

// this layout has NO sidebar
function AuthLayout() {
    return (
        <div>
            <Outlet />
        </div>
    );
}

export default AuthLayout;
