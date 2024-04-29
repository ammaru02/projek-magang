import React, { useState } from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';
import Sidebar from '../sidebar/Sidebar';
import { FaBars } from 'react-icons/fa';

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <Container fluid>
            <Row>
                <Col xs={1}>
                    <FaBars 
                        size={20} 
                        onClick={() => setSidebarOpen(!sidebarOpen)} 
                        className="mt-2 ml-2" 
                        style={{ cursor: 'pointer' }} 
                    />
                </Col>
                <Col xs={sidebarOpen ? 3 : 0}>
                    {sidebarOpen && <Sidebar />}
                </Col>
                <Col>
                    <Row className="mt-2">
                        <Col>
                            <Card style={{ width: '18rem' }} className="mx-auto">
                                <Card.Body>
                                    <Card.Title>Produk Desa</Card.Title>
                                    <Card.Text>
                                        Informasi tentang produk desa.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col>
                            <Card style={{ width: '18rem' }} className="mx-auto">
                                <Card.Body>
                                    <Card.Title>Struktur Desa</Card.Title>
                                    <Card.Text>
                                        Informasi tentang struktur desa.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;
