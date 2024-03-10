import React from 'react';
import { Spinner } from 'react-bootstrap';
const DashboardSpinner = props =>(
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100%' }}>
        <Spinner animation="border" />
        Loading...
    </div>
)

export default DashboardSpinner;