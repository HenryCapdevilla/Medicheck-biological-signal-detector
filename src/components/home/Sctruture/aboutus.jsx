import React from 'react';
import './aboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-container">
      <h1>Acerca de Nosotros</h1>

      {/* Descripción del proyecto */}
      <section className="about-section">
        <h2>El Proyecto</h2>
        <p>
          Este proyecto es una plataforma web de videollamadas enfocada en la gestión de historias clínicas, 
          que permite a médicos y pacientes interactuar en un entorno seguro y confiable. El objetivo principal 
          es facilitar la comunicación y almacenamiento de información médica de manera estructurada y accesible.
        </p>
      </section>

      {/* Integrantes */}
      <section className="about-section">
        <h2>Integrantes del Equipo</h2>
        <ul className="team-list">
          <li>Juan Pérez - Desarrollador Frontend</li>
          <li>María López - Desarrolladora Backend</li>
          <li>Laura Gómez - Diseñadora UX/UI</li>
          <li>Carlos Ramírez - Ingeniero de Infraestructura</li>
        </ul>
      </section>

      {/* Lenguajes y tecnologías */}
      <section className="about-section">
        <h2>Tecnologías Usadas</h2>
        <p>Este proyecto fue desarrollado utilizando:</p>
        <ul className="tech-list">
          <li>React.js - Frontend</li>
          <li>Node.js (Express) - Backend</li>
          <li>Socket.IO - Comunicación en tiempo real para videollamadas</li>
          <li>MongoDB - Base de datos para almacenamiento de usuarios e historias clínicas</li>
          <li>CSS - Estilización y diseño de interfaz</li>
        </ul>
      </section>

      {/* Infraestructura */}
      <section className="about-section">
        <h2>Infraestructura Implementada</h2>
        <p>La infraestructura de la plataforma se basa en los siguientes servicios:</p>
        <ul className="infra-list">
          <li>AWS - Servidor principal</li>
          <li>Docker - Contenedores para despliegue y escalabilidad</li>
          <li>NGINX - Proxy inverso para balanceo de carga</li>
          <li>HTTPS - Seguridad y encriptación de datos</li>
        </ul>
      </section>
    </div>
  );
};

export default AboutUs;
