import React from 'react'
import './bannerText.css'
import DisplayButtons from './displayButtons'
const BannerText = ( {titulo, slogantext} ) => {

  return (
    <div className='header-txt'>
        <p id='title'>{titulo}</p>
        <p id='slogan'>
            {slogantext}
        </p>
        <DisplayButtons/>
    </div>
  )
}

export default BannerText
