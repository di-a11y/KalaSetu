import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';

/* ─────────────────────────────────────────────
   Payment method icons (inline SVG placeholders)
   Replace with your actual icon images if needed
───────────────────────────────────────────── */
const PaymentBadge = ({ label }) => (
  <span className="border border-gray-300 rounded px-2 py-1 text-[10px] font-semibold text-gray-600 tracking-wide">
    {label}
  </span>
);

/* ─────────────────────────────────────────────
   Single cart item row  
───────────────────────────────────────────── */
const CartItem = ({ item, product, currency, onRemove, onQuantityChange, onWishlist }) => {
  const [wishlisted, setWishlisted] = useState(false);

  if (!product) return null; // guard: product not found in context

  return (
    <div className="flex gap-4 sm:gap-6 py-6 border-b border-gray-200">

      {/* ── Product Image ── */}
      <div className="w-28 sm:w-36 flex-shrink-0 bg-gray-100">
        <img
          src={product.image?.[0]}
          alt={product.name}
          className="w-full h-full object-cover"
          style={{ aspectRatio: '3/4' }}
        />
      </div>

      {/* ── Details ── */}
      <div className="flex-1 flex flex-col justify-between min-w-0">

        {/* Top row: name + delete */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">
              {product.category}{product.subCategory ? ` · ${product.subCategory}` : ''}
            </p>
            <h3 className="font-bold text-sm sm:text-base uppercase leading-snug">
              {product.name}
            </h3>
          </div>

          {/* Delete button */}
          <button
            onClick={() => onRemove(item._id, item.size)}
            title="Remove item"
            className="flex-shrink-0 p-1 text-gray-400 hover:text-black transition-colors"
          >
            {/* Trash icon */}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        {/* Color & Size */}
        <div className="mt-2 space-y-0.5 text-sm text-gray-600">
          {product.color && <p>{product.color}</p>}
          <p>Size: <span className="font-medium text-black">{item.size}</span></p>
        </div>

        {/* Low stock badge — show when quantity <= 3, adjust logic as needed */}
        {item.quantity <= 3 && (
          <p className="text-xs font-semibold text-orange-500 mt-1">Low in stock</p>
        )}

        {/* Bottom row: quantity selector + wishlist + price */}
        <div className="flex items-center justify-between mt-4 gap-4 flex-wrap">

          {/* Quantity dropdown */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={item.quantity}
                onChange={(e) => onQuantityChange(item._id, item.size, Number(e.target.value))}
                className="appearance-none border border-gray-300 rounded-none px-3 py-2 pr-8 text-sm 
                           bg-white cursor-pointer focus:outline-none focus:border-black"
              >
                {/* Allow quantity 1–10 */}
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              {/* Custom chevron */}
              <svg
                className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Wishlist heart */}
            <button
              onClick={() => { setWishlisted(!wishlisted); onWishlist?.(item._id); }}
              title={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
              className="p-1 text-gray-400 hover:text-black transition-colors"
            >
              <svg
                className={`w-5 h-5 transition-colors duration-200
                  ${wishlisted ? 'fill-red-500 stroke-red-500' : 'fill-none stroke-current'}`}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          {/* Line price */}
          <p className="text-sm sm:text-base font-semibold text-right">
            {currency}
            {Number(product.price * item.quantity).toLocaleString('en-IN')}.00
          </p>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Main Cart Component
───────────────────────────────────────────── */
const Cart = () => {
  const { products, currency, cartItems, updateQuantity, removeFromCart } = useContext(ShopContext);
  const navigate = useNavigate();

  // ── cartData: flat array built from the nested cartItems object ──
  const [cartData, setCartData] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [promoOpen, setPromoOpen] = useState(false);

  useEffect(() => {
    /*
      cartItems shape (from your ShopContext):
        {
          "productId1": { "M": 2, "L": 1 },
          "productId2": { "S": 1 }
        }

      BUG FIX: your original code used `item` for both loops
      and referenced `items` (undefined) for _id.
      Fixed: outer = itemId, inner = size.
    */
    const tempData = [];

    for (const itemId in cartItems) {          // itemId = product _id
      for (const size in cartItems[itemId]) {  // size = "S", "M", etc.
        if (cartItems[itemId][size] > 0) {
          tempData.push({
            _id: itemId,
            size: size,
            quantity: cartItems[itemId][size],
          });
        }
      }
    }

    setCartData(tempData);
  }, [cartItems]);

  // ── Helpers ──────────────────────────────────────────────────────

  // Find the product object for a given _id
  const getProduct = (id) => products.find((p) => p._id === id);

  // Remove item — calls context fn (add this to ShopContext if missing)
  const handleRemove = (productId, size) => {
    if (removeFromCart) removeFromCart(productId, size);
  };

  // Update quantity — calls context fn (add this to ShopContext if missing)
  const handleQuantityChange = (productId, size, qty) => {
    if (updateQuantity) updateQuantity(productId, size, qty);
  };

  // ── Order summary calculations ───────────────────────────────────
  const subtotal = cartData.reduce((acc, item) => {
    const product = getProduct(item._id);
    return acc + (product ? product.price * item.quantity : 0);
  }, 0);

  const totalItems = cartData.reduce((acc, item) => acc + item.quantity, 0);
  const deliveryFree = subtotal > 999; // free above ₹999 — adjust as needed
  const total = deliveryFree ? subtotal : subtotal + 99;

  // ── Empty cart state ─────────────────────────────────────────────
  if (cartData.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
        <svg className="w-16 h-16 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 11H4L5 9z" />
        </svg>
        <h2 className="text-2xl font-bold uppercase">Your bag is empty</h2>
        <p className="text-gray-500 text-sm">Looks like you haven't added anything yet.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-2 px-8 py-3 bg-black text-white text-sm font-bold uppercase 
                     hover:bg-gray-800 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-8 py-8">

      {/* ── Page heading ── */}
      <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-1">
        Your Bag{' '}
        <span className="font-normal text-gray-500 text-xl">({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Items in your bag are not reserved — check out now to make them yours.
      </p>

      {/* ── Delivery notice banner ── */}
      <div className="bg-gray-100 rounded px-4 py-3 mb-6 text-sm text-gray-700">
        🚚 Free delivery on orders above {currency}999. Orders ship within 1–3 business days.
      </div>

      {/* ── Two-column layout (items left, summary right) ── */}
      <div className="flex flex-col lg:flex-row gap-10">

        {/* ════════ LEFT: Cart Items ════════ */}
        <div className="flex-1 min-w-0">
          {cartData.map((item) => (
            <CartItem
              key={`${item._id}-${item.size}`}
              item={item}
              product={getProduct(item._id)}
              currency={currency}
              onRemove={handleRemove}
              onQuantityChange={handleQuantityChange}
            />
          ))}
        </div>

        {/* ════════ RIGHT: Order Summary ════════ */}
        <div className="lg:w-80 xl:w-96 flex-shrink-0">

          {/* Sticky wrapper */}
          <div className="lg:sticky lg:top-6 space-y-0">

            <h2 className="text-xl font-black uppercase tracking-tight mb-5">Order Summary</h2>

            {/* Line items */}
            <div className="space-y-3 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
                <span className="font-medium">
                  {currency}{subtotal.toLocaleString('en-IN')}.00
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery</span>
                <span className={`font-medium ${deliveryFree ? 'text-green-600' : ''}`}>
                  {deliveryFree ? 'Free' : `${currency}99.00`}
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 pt-4 mb-5">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-base">Total</span>
                <span className="font-bold text-lg">
                  {currency}{total.toLocaleString('en-IN')}.00
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">Inclusive of all taxes</p>
            </div>

            {/* Promo code accordion */}
            <button
              onClick={() => setPromoOpen(!promoOpen)}
              className="w-full flex items-center justify-between py-3 border-t border-b border-gray-200 
                         text-sm font-semibold hover:opacity-70 transition-opacity mb-4"
            >
              <span>Use points or promo code</span>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${promoOpen ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {promoOpen && (
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter promo code"
                  className="flex-1 border border-gray-300 px-3 py-2 text-sm 
                             focus:outline-none focus:border-black transition-colors"
                />
                <button
                  className="px-4 py-2 bg-black text-white text-sm font-semibold 
                             hover:bg-gray-800 transition-colors"
                >
                  Apply
                </button>
              </div>
            )}

            {/* Checkout CTA */}
            <button
              onClick={() => navigate('/place-order')}
              className="w-full py-4 bg-black text-white font-bold text-sm uppercase 
                         flex items-center justify-center gap-2
                         hover:bg-gray-800 active:scale-[.98] transition-all duration-150"
            >
              Checkout
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>

            {/* Payment methods */}
            <div className="mt-5">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-2 font-semibold">
                Accepted Payment Methods
              </p>
              <div className="flex flex-wrap gap-2">
                <PaymentBadge label="VISA" />
                <PaymentBadge label="Mastercard" />
                <PaymentBadge label="RuPay" />
                <PaymentBadge label="UPI" />
                <PaymentBadge label="Net Banking" />
                <PaymentBadge label="COD" />
              </div>
            </div>

            {/* Trust badges */}
            <div className="mt-6 space-y-2">
              {[
                'Free Delivery on orders above ₹999',
                '14* Days Free Returns & Exchange',
                'Safe & Secure Payment Options',
              ].map((text) => (
                <div key={text} className="flex items-center gap-2 text-xs text-gray-600">
                  <svg className="w-4 h-4 flex-shrink-0 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {text}
                </div>
              ))}
            </div>

          </div>
        </div>
        {/* ─── end right panel ─── */}

      </div>
    </div>
  );
};

export default Cart;