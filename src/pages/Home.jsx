import React from 'react'
import Hero from '../components/Hero'
import PopularCategory from '../components/PopularCategory'
import LatestStories from '../components/LatestStories'
import OurPolicy from '../components/OurPolicy'

const Home = () => {
  return (
    <div>
      <Hero />
      <PopularCategory />
      <LatestStories />
      <OurPolicy />
    </div>
  )
}

export default Home
