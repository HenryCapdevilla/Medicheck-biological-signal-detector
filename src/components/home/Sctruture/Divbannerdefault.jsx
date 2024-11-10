import React from 'react';
import BannerText from './BannerTextdefault.jsx';
import Imagenbanner from '../imagenbanner.jsx';
import Navbardefault from './navbardefault.jsx';
import './divbanner.css';

const Divbannerdefault = () => {
    return (
        <div>
            <Navbardefault /> {/* Agrega el componente de la barra de navegación */}
            <div className='ContainerBanner'>
                <BannerText 
                    titulo="Medicheck" 
                    slogantext="Mejoramos tu bienestar: Acceso a consultas médicas y monitoreo remoto de signos vitales desde la comodidad de tu hogar, con precisión y confianza."
                />
                <Imagenbanner href='./images/header.png' text='Medicos' />
            </div>
        </div>
    );
};

export default Divbannerdefault;
