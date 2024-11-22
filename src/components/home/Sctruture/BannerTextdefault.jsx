import React from 'react'
import './bannerText.css'
const BannerTextdefault = ( {titulo, slogantext} ) => {

  return (
    <div className='header-txt'>
        <p id='title'>{titulo}</p>
        <p id='slogan'>
            {slogantext}
        </p>
    </div>
  )
}

export default BannerTextdefault
