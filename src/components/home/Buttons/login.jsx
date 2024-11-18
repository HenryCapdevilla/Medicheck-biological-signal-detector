import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const LoginButton = ({ text }) => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/login'); // Ajusta la ruta según tu configuración
  };

  return (
    <StyledWrapper>
      <button className="button type1" onClick={handleRedirect}>
        <span className="btn-txt">{text}</span>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  padding-bottom: 1em;
  .button {
    height: 1.8em;
    width: 4em;
    position: relative;
    background-color: transparent;
    cursor: pointer;
    border: 2px solid #fff;
    overflow: hidden;
    border-radius: 30px;
    color: #fff;
    transition: all 0.5s ease-in-out;
    display: flex; /* Usamos flexbox */
    justify-content: center; /* Centra horizontalmente */
    align-items: center; /* Centra verticalmente */
  }

  .btn-txt {
    z-index: 1;
    font-weight: 400;
    text-align: center; /* Asegura que el texto esté centrado */
  }

  .type1::after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    transition: all 0.5s ease-in-out;
    background-color: #00ff0d;
    border-radius: 30px;
    visibility: hidden;
    height: 10px;
    width: 10px;
    z-index: -1;
  }

  .button:hover {
    box-shadow: 1px 1px 200px #00ff0d;
    color: #fff;
    border: none;
  }

  .type1:hover::after {
    visibility: visible;
    transform: scale(100) translateX(2px);
  }
`;

export default LoginButton;
