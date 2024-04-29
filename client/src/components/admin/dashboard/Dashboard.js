import React, { useState } from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';
import Sidebar from '../sidebar/Sidebar';
import { FaBars } from 'react-icons/fa';

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <>
        <div>
            <h1>INI DASHBORD</h1>
        </div>
        </>
    );
};

export default Dashboard;
