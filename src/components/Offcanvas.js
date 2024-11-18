import React, { useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import {
  AiOutlineMenu,
  AiOutlineHome,
  AiOutlineFundProjectionScreen,
  AiOutlineUser,
} from "react-icons/ai";
import { CgFileDocument } from "react-icons/cg";
import LoginButton from "./home/Buttons/login";
import LogoutButton from "./home/Buttons/ButtonLogout";
import { useAuth } from "../context/AuthContext";

function OffcanvasMenu() {
  const [show, setShow] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      {/* Icono de menú para abrir el Offcanvas */}
      <Button
        variant="link"
        className="position-fixed top-0 start-0 z-3 p-3"
        onClick={handleShow}
        style={{ zIndex: 1050 }}
      >
        <AiOutlineMenu size={30} />
      </Button>

      {/* Offcanvas con las rutas */}
      <Offcanvas show={show} onHide={handleClose} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menú</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Item>
              <Nav.Link as={Link} to="/" onClick={handleClose}>
                <AiOutlineHome className="me-2" /> Home
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/about" onClick={handleClose}>
                <AiOutlineUser className="me-2" /> About Us
              </Nav.Link>
            </Nav.Item>
            {isAuthenticated && (
              <>
                <Nav.Item>
                  <Nav.Link as={Link} to="/profile" onClick={handleClose}>
                    <AiOutlineUser className="me-2" /> Perfil
                  </Nav.Link>
                </Nav.Item>

                {user?.role === "paciente" && (
                  <Nav.Item>
                    <Nav.Link
                      as={Link}
                      to="/videollamada"
                      onClick={handleClose}
                    >
                      <CgFileDocument className="me-2" /> Conéctate
                    </Nav.Link>
                  </Nav.Item>
                )}

                {(user?.role === "medico" || user?.role === "admin") && (
                  <>
                    <Nav.Item>
                      <Nav.Link as={Link} to="/dashboard" onClick={handleClose}>
                        <AiOutlineFundProjectionScreen className="me-2" />{" "}
                        Dashboard
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link
                        as={Link}
                        to="/videollamada"
                        onClick={handleClose}
                      >
                        <CgFileDocument className="me-2" /> Conéctate
                      </Nav.Link>
                    </Nav.Item>
                  </>
                )}

                <Nav.Item>
                  <LogoutButton />
                </Nav.Item>
              </>
            )}
            {!isAuthenticated && (
              <Nav.Item>
                <LoginButton text="Login" />
              </Nav.Item>
            )}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default OffcanvasMenu;
