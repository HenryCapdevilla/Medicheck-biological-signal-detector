import React from 'react';
import BannerText from './BannerTextdefault.jsx';
import { Container, Row, Col } from 'react-bootstrap';
import "./divbanner.css"
import DisplayButtonsdefault from "./BannerTextdefault"

const CrudRooms = () => {
  return (
    <div>
      <Container fluid className="py-4">
        {/* Banner */}
        <Row className="align-items-center">
          <Col
            xs={12}
            lg={7}
            className="text-center text-lg-start mb-4 mb-lg-0 col-lg-6 col-8"
            style={{ flexBasis: "50%" }}
          >
            <BannerText
              titulo="Medicheck"
              slogantext="Mejoramos tu bienestar: Acceso a consultas médicas y monitoreo remoto de signos vitales desde la comodidad de tu hogar, con precisión y confianza."
            />
          </Col>
          <Col
            xs={12}
            lg={5}
            className="text-center"
            style={{ flexBasis: "30%" }}
          >
            <DisplayButtonsdefault/>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CrudRooms;
