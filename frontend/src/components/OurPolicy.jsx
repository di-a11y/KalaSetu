import React from 'react'
import exchange_icon from '../assets/frontend_assets/exchange_icon.png'
import quality_icon from '../assets/frontend_assets/quality_icon.png'
import support_img from '../assets/frontend_assets/support_img.png'

const OurPolicy = () => {
  return (
    <section className='bg-[#fcf9e9]'>
    <div className='flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700'>
      
      <div>
        <img src={exchange_icon} className='w-12 m-auto mb-5' alt=""/>
        <p className='font-semibold'>Easy Exchange Policy</p>
        <p className='text-gray-400'>We offer hassle free exchange policy</p>
      </div>

      <div>
        <img src={quality_icon} className='w-12 m-auto mb-5' alt=""/>
        <p className='font-semibold'>7 Days Return policy</p>
        <p className='text-gray-400'>We provide 7 days free return policy</p>
      </div>

      <div>
        <img src={support_img} className='w-12 m-auto mb-5' alt=""/>
        <p className='font-semibold'>Best customer support</p>
        <p className='text-gray-400'>We Provide 24/7 customer support</p>
      </div>

    </div>
    </section>
  )
}

export default OurPolicy;
