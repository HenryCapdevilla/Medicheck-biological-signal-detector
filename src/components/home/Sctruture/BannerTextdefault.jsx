import React from 'react'
import './bannerText.css'
import { Container, Row, Col } from 'react-bootstrap';
import DisplayButtonsdefault from './displayButtonsdefault'
const BannerTextdefault = ( {titulo, slogantext} ) => {

  return (
    <div className='header-txt'>
        <p id='title'>{titulo}</p>
        <p id='slogan'>
            {slogantext}
        </p>
        {/* DisplayButtonsdefault debajo del BannerText */}
        <div className="mt-4">
          <DisplayButtonsdefault />
        </div>
    </div>
  )
}

export default BannerTextdefault
