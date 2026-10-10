import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';

const Orders = () => {

  const navigate = useNavigate();
  const { backendUrl, token, currency } = useContext(ShopContext);

  const [ordersData, setOrdersData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrderData = async () => {
    try {

      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.post(
        backendUrl + '/api/order/userOrders',
        {},
        { headers: { token } }
      );

      if (response.data.success) {

        let allOrdersItem = [];

        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            allOrdersItem.push({
              ...item,
              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date,
            });
          });
        });

        // Most recent orders first
        allOrdersItem.sort((a, b) => b.date - a.date);

        setOrdersData(allOrdersItem);
      }

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // FIX: loadOrderData was defined but never actually called.
  // Runs on mount, and again if the token changes (e.g. right after login).
  useEffect(() => {
    loadOrderData();
  }, [token]);


  if (loading) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 sm:px-8 py-12">
        <p className="text-sm text-gray-500">Loading your orders…</p>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <h2 className="text-2xl font-bold uppercase">Please sign in</h2>
        <p className="text-sm text-gray-500">Sign in or create an account to view your order history.</p>
        <button
          onClick={() => navigate('/login')}
          className="px-8 py-3 bg-black text-white text-sm font-bold uppercase hover:bg-gray-800 transition-colors"
        >
          Sign In / Sign Up
        </button>
      </div>
    );
  }

  if (ordersData.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 px-4 text-center">
        <h2 className="text-2xl font-bold uppercase">No orders yet</h2>
        <p className="text-sm text-gray-500">Your past orders will show up here.</p>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-8 py-8">

      <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-6">
        My Orders
      </h1>

      <div className="divide-y divide-gray-200 border-t border-gray-200">

        {ordersData.map((item, index) => (

          <div
            key={index}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6"
          >

            {/* ── Item info ── */}
            <div className="flex gap-4 flex-1 min-w-0">

              <div className="w-20 flex-shrink-0 bg-gray-100" style={{ aspectRatio: '3/4' }}>
                <img
                  src={item.images?.[0]}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="min-w-0">

                <p className="font-bold text-sm sm:text-base uppercase leading-snug">
                  {item.name}
                </p>

                <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-sm text-gray-500 mt-1">
                  <span>{currency}{item.price}</span>
                  <span>Qty: {item.quantity}</span>
                  {item.size && <span>Size: {item.size}</span>}
                </div>

                <p className="text-xs text-gray-400 mt-2">
                  Ordered on {new Date(item.date).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  })}
                </p>

                <p className="text-xs text-gray-400 mt-0.5">
                  Payment: {item.paymentMethod?.toUpperCase()} · {item.payment ? 'Paid' : 'Pending'}
                </p>

              </div>

            </div>

            {/* ── Status + track ── */}
            <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-56 flex-shrink-0">

              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                <p className="text-sm font-medium">{item.status}</p>
              </div>

              <button
                onClick={loadOrderData}
                className="border border-gray-300 px-4 py-2 text-xs font-semibold uppercase
                           hover:border-black transition-colors"
              >
                Track Order
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default Orders;
