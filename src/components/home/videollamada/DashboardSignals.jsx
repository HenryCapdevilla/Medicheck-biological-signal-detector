import React, { useState } from 'react';
import { HeartIcon, GlobeAltIcon } from '@heroicons/react/outline'; // Íconos para BPM y SPO2
import { Card, Row, Col, Container } from 'react-bootstrap'; // Componentes de Bootstrap
import './DashboardSignals.css';

const UserCard = ({ heartRate, spO2 }) => {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(!clicked);
  };

  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        {/* Card de Frecuencia Cardiaca */}
        <Col xs={12} sm={6} md={10} className="mb-3">
          <Card className="statBox custom-card" onClick={handleClick}>
            <Card.Body>
              <HeartIcon className="icon mb-2" />
              <Card.Text className={`statText ${clicked ? 'show' : ''}`}>
                {heartRate} bpm
              </Card.Text>
            </Card.Body>
          </Card>
          <Card className="statBox custom-card" onClick={handleClick}>
            <Card.Body>
              <GlobeAltIcon className="icon mb-2" />
              <Card.Text className={`statText ${clicked ? 'show' : ''}`}>
                {spO2}% O₂
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserCard;
