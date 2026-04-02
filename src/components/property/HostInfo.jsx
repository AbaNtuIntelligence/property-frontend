import React from 'react';
import './HostInfo.css';

export default function HostInfo({ host, propertyId }) {  // Add 'default'
    return (
        <div className="host-info">
            <h3>Hosted by {host?.name}</h3>
            {/* rest of your component */}
        </div>
    );
}