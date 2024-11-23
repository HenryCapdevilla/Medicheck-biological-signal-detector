import React from 'react';
import BannerText from './BannerTextdefault.jsx';
import { Container, Row, Col } from 'react-bootstrap';
import "./divbanner.css";

const CrudRooms = () => {
  return (
    <div>
      <Container fluid className="py-4">
        {/* Banner */}
        <Row className="align-items-center">
          {/* Columna única que ocupa el 100% del ancho */}
          <Col
            xs={12}  // En pantallas pequeñas ocupará todo el espacio
            className="text-center text-lg-start mb-4 mb-lg-0"
            style={{ flexBasis: "100%" }}
          >
            {/* BannerText */}
            <BannerText
              titulo="Medicheck"
              slogantext="Mejoramos tu bienestar: Acceso a consultas médicas y monitoreo remoto de signos vitales desde la comodidad de tu hogar, con precisión y confianza."
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CrudRooms;
