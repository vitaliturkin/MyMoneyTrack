import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <div className="error-page text-center mt-5">
            <h2 className="headline text-warning">404</h2>

            <div className="error-content">
                <h3>
                    <i className="fas fa-exclamation-triangle text-warning"></i> Oops! Page not found.
                </h3>

                <p>
                    We could not find the page you were looking for.
                    Meanwhile, you may <Link to="/">return to the dashboard</Link>.
                </p>
            </div>
        </div>
    );
}

export default NotFound;
