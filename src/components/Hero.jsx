import React from 'react'
import Hero_photo from "../assets/frontend_assets/Hero_photo.png"

const Hero = () => {
  return (
    <div className='flex flex-col sm:flex-row border border-gray-400'>
        <div className=''>
            <img src={Hero_photo} className='py-9 px-10'/>
        </div>
    
    </div>
  )
}

export default Hero
