import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'

/* ════════════════════════════════════════
   STATUS CONFIG
   Maps each status to a colour + label
════════════════════════════════════════ */
const STATUS_STYLES = {
  'Order Placed':      { bg: '#eff6ff', color: '#1d4ed8', dot: '#3b82f6' },
  'Packing':           { bg: '#fefce8', color: '#854d0e', dot: '#eab308' },
  'Shipped':           { bg: '#f0fdf4', color: '#166534', dot: '#22c55e' },
  'Out for Delivery':  { bg: '#fff7ed', color: '#9a3412', dot: '#f97316' },
  'Delivered':         { bg: '#f0fdf4', color: '#14532d', dot: '#16a34a' },
}

const STATUS_OPTIONS = Object.keys(STATUS_STYLES)

/* ── Small status badge ── */
const StatusBadge = ({ status }) => {
  const s = STATUS_STYLES[status] || { bg: '#f5eedc', color: '#7a5c3a', dot: '#c9a96e' }
  return (
    <span
      className='inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full'
      style={{ background: s.bg, color: s.color }}
    >
      <span className='w-1.5 h-1.5 rounded-full' style={{ background: s.dot }} />
      {status}
    </span>
  )
}

/* ── Package icon ── */
const PackageIcon = () => (
  <svg className='w-5 h-5' fill='none' stroke='currentColor' strokeWidth={1.5} viewBox='0 0 24 24'>
    <path strokeLinecap='round' strokeLinejoin='round'
      d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' />
  </svg>
)

/* ── Skeleton card ── */
const SkeletonCard = () => (
  <div className='rounded-2xl p-5 animate-pulse' style={{ background: '#ffffff', border: '1px solid #e8d5a3' }}>
    <div className='flex gap-3 mb-4'>
      <div className='w-10 h-10 rounded-lg bg-[#e8d5a3]' />
      <div className='flex-1 flex flex-col gap-2'>
        <div className='h-3 bg-[#e8d5a3] rounded w-1/3' />
        <div className='h-2 bg-[#e8d5a3] rounded w-1/4' />
      </div>
    </div>
    <div className='flex gap-2 mb-4'>
      <div className='w-12 h-12 rounded bg-[#e8d5a3]' />
      <div className='w-12 h-12 rounded bg-[#e8d5a3]' />
    </div>
    <div className='h-2 bg-[#e8d5a3] rounded w-2/3' />
  </div>
)

/* ════════════════════════════════════════
   ORDERS PAGE
════════════════════════════════════════ */
const Orders = ({ token }) => {
  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(true)

  /* Fetch all orders */
  const fetchOrders = async () => {
    setLoading(true)
    try {
      // TODO: GET /api/order/list  →  { success, orders: [...] }
      const response = await axios.get(backendUrl + '/api/order/list', {
        headers: { token },
      })
      if (response.data.success) {
        /* Newest first */
        const sorted = [...response.data.orders].sort((a, b) => b.date - a.date)
        setOrders(sorted)
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

  /* Update order status */
  const updateStatus = async (orderId, status) => {
    try {
      // TODO: POST /api/order/status  →  { success, message }
      const response = await axios.post(
        backendUrl + '/api/order/status',
        { orderId, status },
        { headers: { token } }
      )
      if (response.data.success) {
        toast.success('Status updated')
        /* Optimistically update UI without full refetch */
        setOrders(prev =>
          prev.map(o => o._id === orderId ? { ...o, status } : o)
        )
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => { fetchOrders() }, [])

  /* Format date from timestamp */
  const formatDate = (ts) => {
    if (!ts) return '—'
    return new Date(ts).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    })
  }

  return (
    <div className='p-6 w-full max-w-5xl'>

      {/* ── Page header ── */}
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-xl font-bold' style={{ color: '#2c1a0e' }}>Orders</h1>
          <p className='text-xs mt-0.5' style={{ color: '#7a5c3a' }}>
            {loading ? 'Loading…' : `${orders.length} order${orders.length !== 1 ? 's' : ''} total`}
          </p>
        </div>
        <button
          onClick={fetchOrders}
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

      {/* ── Loading skeletons ── */}
      {loading && (
        <div className='flex flex-col gap-4'>
          {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && orders.length === 0 && (
        <div
          className='flex flex-col items-center justify-center py-20 rounded-2xl gap-3'
          style={{ background: '#ffffff', border: '1px solid #c9a96e' }}
        >
          <svg className='w-14 h-14' fill='none' stroke='#c9a96e' strokeWidth={1} viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round'
              d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' />
          </svg>
          <p className='text-sm font-medium' style={{ color: '#7a5c3a' }}>No orders yet.</p>
          <p className='text-xs' style={{ color: '#9a7d50' }}>
            Orders placed by customers will appear here.
          </p>
        </div>
      )}

      {/* ── Order cards ── */}
      {!loading && orders.length > 0 && (
        <div className='flex flex-col gap-4'>
          {orders.map((order) => (
            <div
              key={order._id}
              className='rounded-2xl overflow-hidden'
              style={{ background: '#ffffff', border: '1px solid #c9a96e' }}
            >
              {/* Card header */}
              <div
                className='flex items-center justify-between px-5 py-3 flex-wrap gap-2'
                style={{ background: '#fdf8ed', borderBottom: '1px solid #e8d5a3' }}
              >
                <div className='flex items-center gap-3'>
                  <div className='p-2 rounded-lg' style={{ background: '#e8d5a3', color: '#8b6914' }}>
                    <PackageIcon />
                  </div>
                  <div>
                    <p className='text-xs font-bold' style={{ color: '#2c1a0e' }}>
                      Order #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p className='text-[10px]' style={{ color: '#9a7d50' }}>
                      Placed on {formatDate(order.date)}
                    </p>
                  </div>
                </div>

                {/* Payment method chip */}
                <span
                  className='text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider'
                  style={{
                    background: order.payment ? '#f0fdf4' : '#fff7ed',
                    color:      order.payment ? '#15803d' : '#c2410c',
                    border:     `1px solid ${order.payment ? '#bbf7d0' : '#fed7aa'}`,
                  }}
                >
                  {order.paymentMethod} · {order.payment ? 'Paid' : 'Pending'}
                </span>
              </div>

              {/* Card body */}
              <div className='px-5 py-4 flex flex-col sm:flex-row gap-5'>

                {/* LEFT: items + address */}
                <div className='flex-1 flex flex-col gap-4'>

                  {/* Items */}
                  <div className='flex flex-col gap-2'>
                    {order.items?.map((item, i) => (
                      <div key={i} className='flex items-center gap-3'>
                        <div className='w-12 h-12 rounded-lg overflow-hidden flex-shrink-0'
                          style={{ border: '1px solid #e8d5a3' }}>
                          <img
                            src={item.image?.[0] || item.images?.[0]}
                            alt={item.name}
                            className='w-full h-full object-cover'
                          />
                        </div>
                        <div>
                          <p className='text-sm font-medium' style={{ color: '#2c1a0e' }}>{item.name}</p>
                          <p className='text-xs' style={{ color: '#7a5c3a' }}>
                            {currency}{Number(item.price).toLocaleString('en-IN')} ·
                            Qty: {item.quantity}
                            {item.size ? ` · Size: ${item.size}` : ''}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Delivery address */}
                  {order.address && (
                    <div className='rounded-xl p-3' style={{ background: '#fdf8ed', border: '1px solid #e8d5a3' }}>
                      <p className='text-[10px] font-bold uppercase tracking-wider mb-1' style={{ color: '#9a7520' }}>
                        Delivery Address
                      </p>
                      <p className='text-xs font-semibold' style={{ color: '#2c1a0e' }}>
                        {order.address.firstName} {order.address.lastName}
                      </p>
                      <p className='text-xs' style={{ color: '#7a5c3a' }}>
                        {order.address.street}
                        {order.address.landmark ? `, ${order.address.landmark}` : ''}
                      </p>
                      <p className='text-xs' style={{ color: '#7a5c3a' }}>
                        {order.address.city}, {order.address.state} – {order.address.zipcode}
                      </p>
                      {order.address.phone && (
                        <p className='text-xs mt-1' style={{ color: '#9a7d50' }}>
                          📞 {order.address.phone}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* RIGHT: total + status ── */}
                <div className='flex flex-col justify-between gap-4 sm:items-end sm:min-w-[180px]'>

                  {/* Total */}
                  <div className='sm:text-right'>
                    <p className='text-[10px] font-bold uppercase tracking-wider mb-0.5' style={{ color: '#9a7520' }}>
                      Order Total
                    </p>
                    <p className='text-xl font-bold' style={{ color: '#2c1a0e' }}>
                      {currency}{Number(order.amount).toLocaleString('en-IN')}
                    </p>
                    <p className='text-[10px]' style={{ color: '#9a7d50' }}>
                      {order.items?.length} item{order.items?.length !== 1 ? 's' : ''} · Incl. taxes
                    </p>
                  </div>

                  {/* Status badge + dropdown */}
                  <div className='flex flex-col gap-1.5'>
                    <StatusBadge status={order.status} />
                    <select
                      value={order.status}
                      onChange={e => updateStatus(order._id, e.target.value)}
                      className='text-xs rounded-lg px-3 py-2 outline-none transition-shadow focus:ring-2 focus:ring-[#c4a270] appearance-none'
                      style={{ background: '#f5eedc', border: '1px solid #c9a96e', color: '#2c1a0e' }}
                    >
                      {STATUS_OPTIONS.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders
