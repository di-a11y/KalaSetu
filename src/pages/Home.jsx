import React from 'react'
import Hero from '../components/Hero'
import PopularCategory from '../components/PopularCategory'
import LatestStories from '../components/LatestStories'

const Home = () => {
  return (
    <div>
      <Hero />
      <PopularCategory />
      <LatestStories />
    </div>
  )
}

export default Home
