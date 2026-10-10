import React from 'react'
import { NavLink } from 'react-router-dom'

/* ── Nav items with inline SVG icons (no asset dependency) ── */
const NAV_ITEMS = [
  {
    to: '/add',
    label: 'Add Product',
    icon: (
      <svg className='w-5 h-5 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2}
          d='M12 4v16m8-8H4' />
      </svg>
    ),
  },
  {
    to: '/list',
    label: 'All Products',
    icon: (
      <svg className='w-5 h-5 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2}
          d='M4 6h16M4 10h16M4 14h16M4 18h16' />
      </svg>
    ),
  },
  {
    to: '/orders',
    label: 'Orders',
    icon: (
      <svg className='w-5 h-5 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2}
          d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' />
      </svg>
    ),
  },
]

const Sidebar = () => {
  return (
    <div
      className='w-[220px] min-h-screen flex flex-col'
      style={{ background: '#fdf8ed', borderRight: '2px solid #c9a96e' }}
    >
      {/* Section label */}
      <div className='px-5 pt-7 pb-2'>
        <p className='text-[10px] font-bold tracking-widest uppercase' style={{ color: '#9a7520' }}>
          Management
        </p>
      </div>

      {/* Nav links */}
      <nav className='flex flex-col gap-1 px-3 mt-1'>
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className='flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200'
            style={({ isActive }) => ({
              background:  isActive ? '#d4b483' : 'transparent',
              color:       isActive ? '#2c1a0e' : '#7a5c3a',
              borderLeft:  isActive ? '3px solid #8b6914' : '3px solid transparent',
              fontWeight:  isActive ? 700 : 500,
            })}
            onMouseEnter={e => {
              if (!e.currentTarget.style.background.includes('d4b483'))
                e.currentTarget.style.background = '#e8d5a3'
            }}
            onMouseLeave={e => {
              if (!e.currentTarget.style.background.includes('d4b483'))
                e.currentTarget.style.background = 'transparent'
            }}
          >
            {icon}
            <span className='hidden md:block'>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Divider + tagline at bottom */}
      <div className='mt-auto px-5 py-5' style={{ borderTop: '1px solid #c9a96e' }}>
        <p className='text-[11px] italic leading-relaxed' style={{ color: '#9a7520', fontFamily: 'Georgia, serif' }}>
          Every Purchase<br />Preserves a Tradition.
        </p>
      </div>
    </div>
  )
}

export default Sidebar
