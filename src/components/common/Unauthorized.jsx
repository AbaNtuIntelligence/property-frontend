import React from 'react';
import { Link } from 'react-router-dom';

function Unauthorized() {
    return (
        <div className="unauthorized-container">
            <h2>Access Denied</h2>
            <p>You don't have permission to access this page.</p>
            <Link to="/property">Go to Properties</Link>
        </div>
    );
}

export default Unauthorized;