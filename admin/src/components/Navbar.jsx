import React from 'react'

const Navbar = ({ setToken }) => {
  return (
    <div
      className='flex items-center py-3 px-6 justify-between'
      style={{
        background: 'linear-gradient(135deg, #5c3d0a 0%, #8b6914 60%, #a07c1a 100%)',
        borderBottom: '3px solid #c9a96e',
      }}
    >
      {/* ── KalaSetu Brand ── */}
      <div className='flex flex-col'>
        <div className='flex items-baseline gap-2'>
          {/* Devanagari "कला" + Latin "SETU" — matches frontend exactly */}
          <span className='font-bold text-2xl text-white' style={{ fontFamily: 'Georgia, serif' }}>
            कला
          </span>
          <span className='font-bold text-lg tracking-[0.2em]' style={{ color: '#f0d080' }}>
            SETU
          </span>
          {/* Admin badge */}
          <span
            className='ml-2 text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded'
            style={{ background: 'rgba(201,169,110,0.25)', border: '1px solid #c9a96e', color: '#f0d080' }}
          >
            Admin Panel
          </span>
        </div>
        <p className='text-xs italic mt-0.5' style={{ color: '#d4b483', fontFamily: 'Georgia, serif' }}>
          Bridging artisans to the world
        </p>
      </div>

      {/* ── Logout ── */}
      <button
        onClick={() => setToken('')}
        className='flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-lg transition-all duration-200 active:scale-95'
        style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', color: 'white' }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.22)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
      >
        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2}
            d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
        </svg>
        Logout
      </button>
    </div>
  )
}

export default Navbar
