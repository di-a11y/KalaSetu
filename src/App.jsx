import React from 'react'
import {Routes,Route} from 'react-router-dom'
import Home from './pages/Home'
import Clothing from './pages/Clothing'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/Placeorder'
import Orders from './pages/Orders'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import NewArrivals from "./pages/Clothing/NewArrivals"; 
import KurtasSets from './pages/Clothing/KurtasSets'
import Dresses from './pages/Clothing/Dresses'
import TopsBlouses from './pages/Clothing/TopsBlouses'
const App = () => {
  return (
    <div >
      
      <Navbar />
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/clothing' element={<Clothing/>} />
        <Route path='/about' element={<About/>} />
        <Route path='/contact' element={<Contact/>} />
        <Route path='/product/:productId' element={<Product/>} />
        <Route path='/cart' element={<Cart/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/place-order' element={<PlaceOrder/>} />
        <Route path='/orders' element={<Orders/>} />
        <Route path="/NewArrivals" element={<NewArrivals />} />
        <Route path="/KurtasSets" element={<KurtasSets />} />
        <Route path="/Dresses" element={<Dresses />} />
        <Route path="/topsBlouses" element={<TopsBlouses />} />
      </Routes>
      <Footer />

      
      
    </div>
  )
}

export default App
