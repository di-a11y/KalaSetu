import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'

/* ── Trash icon ── */
const TrashIcon = () => (
  <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth={2} viewBox='0 0 24 24'>
    <path strokeLinecap='round' strokeLinejoin='round'
      d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
  </svg>
)

/* ── Skeleton row (shown while loading) ── */
const SkeletonRow = () => (
  <div className='grid grid-cols-[72px_3fr_1.5fr_1fr_72px] items-center gap-4 px-4 py-3 rounded-xl animate-pulse'
    style={{ background: '#f5eedc', border: '1px solid #e8d5a3' }}>
    <div className='w-14 h-14 rounded-lg bg-[#e8d5a3]' />
    <div className='h-3 rounded bg-[#e8d5a3] w-3/4' />
    <div className='h-3 rounded bg-[#e8d5a3] w-1/2' />
    <div className='h-3 rounded bg-[#e8d5a3] w-1/3' />
    <div className='h-3 rounded bg-[#e8d5a3] w-6 mx-auto' />
  </div>
)

const List = ({ token }) => {
  const [list,    setList]    = useState([])
  const [loading, setLoading] = useState(true)

  const fetchList = async () => {
    setLoading(true)
    try {
      const response = await axios.get(backendUrl + '/api/product/list')
      if (response.data.success) {
        setList(response.data.products)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/product/remove',
        { id },
        { headers: { token } }
      )
      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => { fetchList() }, [])

  return (
    <div className='p-6 w-full max-w-5xl'>

      {/* ── Page header ── */}
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-xl font-bold' style={{ color: '#2c1a0e' }}>All Products</h1>
          <p className='text-xs mt-0.5' style={{ color: '#7a5c3a' }}>
            {loading ? 'Loading…' : `${list.length} product${list.length !== 1 ? 's' : ''} listed`}
          </p>
        </div>
        <button
          onClick={fetchList}
          className='flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-95'
          style={{ background: '#f5eedc', border: '1px solid #c9a96e', color: '#7a5c3a' }}
          onMouseEnter={e => e.currentTarget.style.background = '#e8d5a3'}
          onMouseLeave={e => e.currentTarget.style.background = '#f5eedc'}
        >
          <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2}
              d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
          </svg>
          Refresh
        </button>
      </div>

      {/* ── Table ── */}
      <div className='rounded-2xl overflow-hidden' style={{ border: '1px solid #c9a96e' }}>

        {/* Header row */}
        <div
          className='hidden md:grid grid-cols-[72px_3fr_1.5fr_1fr_72px] items-center gap-4 px-4 py-3'
          style={{ background: 'linear-gradient(135deg, #5c3d0a, #8b6914)', color: 'white' }}
        >
          <span className='text-xs font-bold tracking-wider uppercase'>Image</span>
          <span className='text-xs font-bold tracking-wider uppercase'>Product Name</span>
          <span className='text-xs font-bold tracking-wider uppercase'>Category</span>
          <span className='text-xs font-bold tracking-wider uppercase'>Price</span>
          <span className='text-xs font-bold tracking-wider uppercase text-center'>Action</span>
        </div>

        {/* Rows */}
        <div className='flex flex-col' style={{ background: '#ffffff' }}>

          {loading && (
            <div className='flex flex-col gap-2 p-3'>
              {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
            </div>
          )}

          {!loading && list.length === 0 && (
            <div className='flex flex-col items-center justify-center py-16 gap-3'>
              <svg className='w-12 h-12' fill='none' stroke='#c9a96e' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5}
                  d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' />
              </svg>
              <p className='text-sm font-medium' style={{ color: '#7a5c3a' }}>No products listed yet.</p>
              <p className='text-xs' style={{ color: '#9a7d50' }}>Add your first artisan product to get started.</p>
            </div>
          )}

          {!loading && list.map((item, index) => (
            <div
              key={index}
              className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[72px_3fr_1.5fr_1fr_72px]
                         items-center gap-4 px-4 py-3 transition-colors duration-150'
              style={{
                borderTop: index === 0 ? 'none' : '1px solid #f0e8d5',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#fdf8ed'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {/* Image */}
              <div className='w-14 h-14 rounded-lg overflow-hidden flex-shrink-0'
                style={{ border: '1px solid #e8d5a3' }}>
                <img
                  src={item.images?.[0] || item.image?.[0]}
                  alt={item.name}
                  className='w-full h-full object-cover'
                />
              </div>

              {/* Name */}
              <p className='text-sm font-medium truncate' style={{ color: '#2c1a0e' }}>
                {item.name}
              </p>

              {/* Category */}
              <span
                className='hidden md:inline-block text-xs font-medium px-2.5 py-1 rounded-full w-fit'
                style={{ background: '#f5eedc', color: '#7a5c3a', border: '1px solid #e8d5a3' }}
              >
                {item.category}
              </span>

              {/* Price */}
              <p className='text-sm font-semibold' style={{ color: '#2c1a0e' }}>
                {currency}{Number(item.price).toLocaleString('en-IN')}
              </p>

              {/* Delete */}
              <div className='flex justify-center'>
                <button
                  onClick={() => removeProduct(item._id)}
                  title='Remove product'
                  className='p-2 rounded-lg transition-all duration-150 active:scale-95'
                  style={{ color: '#9a7d50', background: 'transparent' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#fff0f0'
                    e.currentTarget.style.color = '#991b1b'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = '#9a7d50'
                  }}
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default List
