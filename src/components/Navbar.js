import React, { useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import logo from "../Assets/logo.png";
import { Link } from "react-router-dom";
import {
  AiOutlineHome,
  AiOutlineFundProjectionScreen,
  AiOutlineUser,
} from "react-icons/ai";
import { CgFileDocument } from "react-icons/cg";
import LoginButton from "./home/Buttons/login";
import LogoutButton from "./home/Buttons/ButtonLogout";
import { useAuth } from "../context/AuthContext";

function NavBar() {
  const [expand, updateExpanded] = useState(false);
  const [navColour, updateNavbar] = useState(false);
  const { user, isAuthenticated } = useAuth();

  function scrollHandler() {
    if (window.scrollY >= 20) {
      updateNavbar(true);
    } else {
      updateNavbar(false);
    }
  }

  window.addEventListener("scroll", scrollHandler);

  return (
    <Navbar
      expanded={expand}
      fixed="top"
      expand="md"
      className={navColour ? "sticky" : "navbar"}
    >
      <Container>
        <Navbar.Brand href="/" className="d-flex">
          <img src={logo} className="img-fluid logo" alt="brand" />
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          onClick={() => {
            updateExpanded(expand ? false : "expanded");
          }}
        >
          <span></span>
          <span></span>
          <span></span>
        </Navbar.Toggle>
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto" defaultActiveKey="#home">
            <Nav.Item>
              <Nav.Link as={Link} to="/">
                <AiOutlineHome style={{ marginBottom: "2px" }} /> Home
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link as={Link} to="/about">
                <AiOutlineUser style={{ marginBottom: "2px" }} /> About Us
              </Nav.Link>
            </Nav.Item>

            {isAuthenticated && (
              <>
                <Nav.Item>
                  <Nav.Link as={Link} to="/profile">
                    <AiOutlineUser style={{ marginBottom: "2px" }} /> Perfil
                  </Nav.Link>
                </Nav.Item>

                {user?.role === "paciente" && (
                  <Nav.Item>
                    <Nav.Link as={Link} to="/homecall">
                      <CgFileDocument style={{ marginBottom: "2px" }} /> Conéctate
                    </Nav.Link>
                  </Nav.Item>
                )}

                {(user?.role === "medico" || user?.role === "admin") && (
                  <>
                    <Nav.Item>
                      <Nav.Link as={Link} to="/dashboard">
                        <AiOutlineFundProjectionScreen
                          style={{ marginBottom: "2px" }}
                        />{" "}
                        Dashboard
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link as={Link} to="/homecall">
                        <CgFileDocument style={{ marginBottom: "2px" }} /> Conéctate
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
              <Nav.Item className="fork-btn">
                <LoginButton text="Login" />
              </Nav.Item>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
