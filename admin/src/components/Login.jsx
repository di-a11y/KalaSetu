import axios from 'axios'
import React, { useState } from 'react'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Login = ({ setToken }) => {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [show,     setShow]     = useState(false)
  const [loading,  setLoading]  = useState(false)

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post(backendUrl + '/api/user/admin', { email, password })
      if (response.data.success) {
        setToken(response.data.token)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className='min-h-screen flex flex-col items-center justify-center px-4'
      style={{ background: '#fdf8ed' }}
    >
      {/* ── Brand header ── */}
      <div className='text-center mb-8'>
        <div className='flex items-baseline justify-center gap-2 mb-1'>
          <span className='font-bold text-4xl' style={{ fontFamily: 'Georgia, serif', color: '#2c1a0e' }}>
            कला
          </span>
          <span className='font-bold text-2xl tracking-[0.2em]' style={{ color: '#8b6914' }}>
            SETU
          </span>
        </div>
        <p className='text-sm italic mb-4' style={{ fontFamily: 'Georgia, serif', color: '#7a5c3a' }}>
          Bridging artisans to the world
        </p>
        {/* Admin badge */}
        <span
          className='text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full'
          style={{ background: '#d4b483', color: '#2c1a0e', border: '1px solid #c9a96e' }}
        >
          🔐 Admin Portal
        </span>
      </div>

      {/* ── Login card ── */}
      <div
        className='w-full max-w-sm rounded-2xl px-8 py-8 shadow-xl'
        style={{ background: '#ffffff', border: '1px solid #c9a96e' }}
      >
        <h2 className='text-lg font-bold mb-0.5' style={{ color: '#2c1a0e' }}>Welcome back</h2>
        <p className='text-xs mb-6' style={{ color: '#7a5c3a' }}>Sign in to manage KalaSetu</p>

        <form onSubmit={onSubmitHandler} className='flex flex-col gap-4'>

          {/* Email */}
          <div className='flex flex-col gap-1'>
            <label className='text-xs font-semibold' style={{ color: '#2c1a0e' }}>Email Address</label>
            <input
              onChange={e => setEmail(e.target.value)}
              value={email}
              className='w-full rounded-lg px-4 py-3 text-sm outline-none transition-shadow focus:ring-2 focus:ring-[#c4a270]'
              style={{ background: '#f5eedc', border: '1px solid #c9a96e', color: '#2c1a0e' }}
              type='email'
              placeholder='admin@kalasetu.com'
              required
            />
          </div>

          {/* Password with show/hide */}
          <div className='flex flex-col gap-1'>
            <label className='text-xs font-semibold' style={{ color: '#2c1a0e' }}>Password</label>
            <div className='relative'>
              <input
                onChange={e => setPassword(e.target.value)}
                value={password}
                className='w-full rounded-lg px-4 py-3 pr-16 text-sm outline-none transition-shadow focus:ring-2 focus:ring-[#c4a270]'
                style={{ background: '#f5eedc', border: '1px solid #c9a96e', color: '#2c1a0e' }}
                type={show ? 'text' : 'password'}
                placeholder='Enter your password'
                required
              />
              <button
                type='button'
                onClick={() => setShow(s => !s)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold hover:opacity-70 transition-opacity'
                style={{ color: '#7a5c3a' }}
              >
                {show ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type='submit'
            disabled={loading}
            className='w-full py-3 rounded-lg text-sm font-bold transition-all duration-200 mt-2 active:scale-[.98] disabled:opacity-60'
            style={{ background: 'linear-gradient(135deg, #5c3d0a, #8b6914)', color: 'white' }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = '0.88' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        {/* Security note */}
        <div
          className='mt-5 rounded-xl px-4 py-3 text-xs text-center leading-relaxed'
          style={{ background: '#fff8ee', border: '1px solid #e8d5a3', color: '#7a5c3a' }}
        >
          ⚠️ Restricted to KalaSetu administrators only.<br />All sessions are monitored.
        </div>
      </div>

      <p className='mt-8 text-xs italic' style={{ color: '#9a7d50', fontFamily: 'Georgia, serif' }}>
        Every Purchase Preserves a Tradition.
      </p>
    </div>
  )
}

export default Login
