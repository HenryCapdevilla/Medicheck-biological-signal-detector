import React from 'react'
import './imagenbanner.css'

const Imagenbanner = ( {href, text} ) => {
  return (
    <div className="header-img">
        <img src={href} alt={text}/>
    </div>
  )
}

export default Imagenbanner
