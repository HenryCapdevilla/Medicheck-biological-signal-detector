import React from 'react'
import BannerText from './bannerText'
import Imagenbanner from './imagenbanner'
import './divbanner.css'
const Divbanner = () => {
    return (
        <div className='ContainerBanner'>
            <BannerText titulo="Medicheck" slogantext="Mejoramos tu bienestar: Acceso a consultas médicas y monitoreo remoto de signos vitales desde la comodidad de tu hogar, con precisión y confianza."/>
            <Imagenbanner href='.\images\header.png' text='Medicos'/>
        </div>
    )
}

export default Divbanner
