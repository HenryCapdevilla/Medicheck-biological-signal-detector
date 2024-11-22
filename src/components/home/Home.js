import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import homeLogo from "../../Assets/home-main.png";
import Type from "./Type";

function Home() {
  return (
    <>
      <section>
        <Container fluid className="home-section" id="home">
          <Container className="home-content">
            <Row>
              <Col md={7} sm={12} className="home-header">
                <h1 className="heading">
                  Bienvenido a MediCheck{" "}
                  <span className="wave" role="img" aria-labelledby="wave">
                    👋🏻
                  </span>
                </h1>

                <h1 className="heading-name">
                  <strong className="main-name"> MediCheck </strong>
                  es una plataforma de teleconsulta que permite a los médicos
                  medir de manera remota y no invasiva los signos vitales de los
                  pacientes.
                </h1>
                <div className="type-container">
                  <Type />
                </div>
              </Col>
                <img
                  src={homeLogo}
                  alt="home pic"
                  className="img-fluid"
                  style={{ maxHeight: "450px" }}
                />
            </Row>
          </Container>
        </Container>
      </section>
    </>
  );
}

export default Home;
