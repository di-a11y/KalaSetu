import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

/* ─────────────────────────────────────────────
   Reusable labelled input field
───────────────────────────────────────────── */
const Field = ({ label, required, hint, type = 'text', value, onChange, children }) => (
  <div className="flex flex-col gap-1">
    <div className="relative border border-gray-300 focus-within:border-black transition-colors">
      {children ? (
        /* Render a custom element (e.g. select) when passed as child */
        children
      ) : (
        <input
          type={type}
          required={required}
          value={value}
          onChange={onChange}
          placeholder=" "
          className="peer w-full px-3 pt-5 pb-2 text-sm bg-transparent focus:outline-none"
        />
      )}
      {/* Floating label — moves up when input is focused or has value */}
      <label className="absolute left-3 top-1 text-[10px] text-gray-400 uppercase tracking-wide pointer-events-none">
        {label}{required && ' *'}
      </label>
    </div>
    {hint && <p className="text-xs text-gray-400 pl-1">{hint}</p>}
  </div>
);

/* ─────────────────────────────────────────────
   Section heading (matches Adidas bold uppercase)
───────────────────────────────────────────── */
const SectionHeading = ({ label, dimmed = false }) => (
  <h2 className={`text-xl sm:text-2xl font-black uppercase tracking-tight mb-5
    ${dimmed ? 'text-gray-300' : 'text-black'}`}>
    {label}
  </h2>
);

/* ─────────────────────────────────────────────
   Indian states list for the dropdown
───────────────────────────────────────────── */
const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
  'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
  'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
  'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
  'Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Andaman and Nicobar Islands','Chandigarh','Dadra and Nagar Haveli',
  'Daman and Diu','Delhi','Jammu and Kashmir','Ladakh','Lakshadweep','Puducherry',
];

/* ─────────────────────────────────────────────
   Payment badge
───────────────────────────────────────────── */
const PayBadge = ({ label }) => (
  <span className="border border-gray-300 rounded px-2 py-1 text-[10px] font-bold text-gray-600 tracking-wide">
    {label}
  </span>
);

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════ */
const PlaceOrder = () => {
  const { products, currency, cartItems } = useContext(ShopContext);
  const navigate = useNavigate();

  /* ── Build flat cart array (same pattern as Cart.jsx) ── */
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const temp = [];
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        if (cartItems[itemId][size] > 0) {
          temp.push({ _id: itemId, size, quantity: cartItems[itemId][size] });
        }
      }
    }
    setCartData(temp);
  }, [cartItems]);

  /* ── Helper: find product object ── */
  const getProduct = (id) => products.find((p) => p._id === id);

  /* ── Order totals ── */
  const subtotal = cartData.reduce((acc, item) => {
    const p = getProduct(item._id);
    return acc + (p ? p.price * item.quantity : 0);
  }, 0);
  const totalItems = cartData.reduce((acc, item) => acc + item.quantity, 0);
  const deliveryFree = subtotal > 999;
  const total = deliveryFree ? subtotal : subtotal + 99;

  /* ── Form state ── */
  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    street: '',
    landmark: '',
    additionalInfo: '',
    city: '',
    state: '',
    pinCode: '',
    mobile: '',
  });

  /* Checkbox state */
  const [sameBilling, setSameBilling]   = useState(true);
  const [newsletter, setNewsletter]     = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  /* Whether address section is unlocked
     (in Adidas, delivery options & payment are dimmed until Next is clicked) */
  const [step, setStep] = useState(1); // 1 = contact+address, 2 = delivery, 3 = payment

  /* Generic field updater */
  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  /* Validate required fields before proceeding */
  const handleNext = () => {
    const required = ['email','firstName','lastName','street','city','state','pinCode','mobile'];
    const missing = required.filter((k) => !form[k].trim());
    if (missing.length > 0 || !termsAccepted) {
      alert('Please fill all required fields and accept the Terms & Conditions.');
      return;
    }
    setStep(2); // unlock delivery + payment
    // Scroll to delivery section
    document.getElementById('delivery-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  /* ── Submit order ── */
  const handleSubmit = () => {
    if (step < 2) { alert('Please complete the address step first.'); return; }
    // TODO: wire up to your backend /api/orders endpoint
    navigate('/orders');
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-8 py-8">

      {/* ── Page header ── */}
      <div className="text-center mb-10 border-b border-gray-200 pb-6">
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">Checkout</h1>
        <p className="text-sm text-gray-500 mt-1">
          ({totalItems} {totalItems === 1 ? 'item' : 'items'}) &nbsp;
          {currency}{total.toLocaleString('en-IN')}.00
        </p>
      </div>

      {/* ── Two-column layout ── */}
      <div className="flex flex-col lg:flex-row gap-12">

        {/* ════════ LEFT: Form ════════ */}
        <div className="flex-1 min-w-0 space-y-12">

          {/* ── CONTACT ── */}
          <section>
            <SectionHeading label="Contact" />

            <Field
              label="Email"
              required
              type="email"
              value={form.email}
              onChange={update('email')}
            />
          </section>

          {/* ── ADDRESS ── */}
          <section>
            <SectionHeading label="Address" />
            <p className="text-sm font-semibold mb-4">Delivery address</p>

            <div className="space-y-4">

              {/* First + Last name — side by side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="First Name" required value={form.firstName} onChange={update('firstName')} />
                <Field label="Last Name"  required value={form.lastName}  onChange={update('lastName')}  />
              </div>

              {/* Street */}
              <Field
                label="Street Address"
                required
                hint="E.g. 3 Stripes Street"
                value={form.street}
                onChange={update('street')}
              />

              {/* Landmark */}
              <Field
                label="Landmark"
                required
                hint="E.g. Company, Apartment, Building, etc."
                value={form.landmark}
                onChange={update('landmark')}
              />

              {/* Additional info + City — side by side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Additional Info" value={form.additionalInfo} onChange={update('additionalInfo')} />
                <Field label="City" required value={form.city} onChange={update('city')} />
              </div>

              {/* State dropdown + Pin code — side by side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* State — custom select wrapped in Field */}
                <Field label="State" required>
                  <select
                    value={form.state}
                    onChange={update('state')}
                    className="w-full px-3 pt-5 pb-2 text-sm bg-transparent focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="" disabled></option>
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {/* Chevron icon for the select */}
                  <svg
                    className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Field>

                <Field label="Pin Code" required value={form.pinCode} onChange={update('pinCode')} />
              </div>

              {/* Country — static display */}
              <p className="text-sm pl-1">
                <span className="font-semibold">Country:</span> India
              </p>

              {/* Mobile */}
              <Field
                label="Mobile Number"
                required
                type="tel"
                hint="We will only call you if there are questions regarding your order."
                value={form.mobile}
                onChange={update('mobile')}
              />

            </div>

            {/* ── Checkboxes ── */}
            <div className="mt-6 space-y-4">

              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={sameBilling}
                  onChange={() => setSameBilling(!sameBilling)}
                  className="mt-0.5 w-4 h-4 accent-black flex-shrink-0"
                />
                <span className="text-sm">My billing and delivery information are the same.</span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={newsletter}
                  onChange={() => setNewsletter(!newsletter)}
                  className="mt-0.5 w-4 h-4 accent-black flex-shrink-0"
                />
                <span className="text-sm">
                  I would like to stay up to date with KalaSetu.{' '}
                  <button className="underline hover:opacity-70 transition-opacity">Read more</button>
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={() => setTermsAccepted(!termsAccepted)}
                  className="mt-0.5 w-4 h-4 accent-black flex-shrink-0"
                />
                <span className="text-sm">
                  Yes, I am over 18 years old & accept the{' '}
                  <button className="underline hover:opacity-70 transition-opacity">Terms & Conditions</button>
                  {' '}and{' '}
                  <button className="underline hover:opacity-70 transition-opacity">Privacy Policy</button>.
                  {' '}<span className="text-red-500">*</span>
                </span>
              </label>

            </div>

            {/* ── Next button ── */}
            <button
              onClick={handleNext}
              className="mt-6 w-full sm:w-64 py-4 bg-black text-white text-sm font-bold uppercase
                         flex items-center justify-between px-6
                         hover:bg-gray-800 active:scale-[.98] transition-all duration-150"
            >
              Next
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </section>

          {/* Divider */}
          <hr className="border-gray-200" />

          {/* ── DELIVERY OPTIONS ── */}
          <section id="delivery-section">
            {/* Dimmed until step 2 */}
            <SectionHeading label="Delivery Options" dimmed={step < 2} />

            {step >= 2 ? (
              <div className="space-y-3">
                {[
                  { id: 'standard', label: 'Standard Delivery', sub: '3–5 business days', price: deliveryFree ? 'Free' : '₹99' },
                  { id: 'express',  label: 'Express Delivery',  sub: '1–2 business days', price: '₹199' },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className="flex items-center justify-between border border-gray-300 p-4 cursor-pointer hover:border-black transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <input type="radio" name="delivery" defaultChecked={opt.id === 'standard'} className="accent-black" />
                      <div>
                        <p className="text-sm font-semibold">{opt.label}</p>
                        <p className="text-xs text-gray-500">{opt.sub}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold">{opt.price}</span>
                  </label>
                ))}
              </div>
            ) : (
              /* Placeholder lines shown while dimmed */
              <div className="h-16 border border-gray-100 bg-gray-50 rounded" />
            )}
          </section>

          {/* Divider */}
          <hr className="border-gray-200" />

          {/* ── PAYMENT ── */}
          <section>
            <SectionHeading label="Payment" dimmed={step < 2} />

            {step >= 2 ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">Select your payment method at checkout.</p>
                <div className="flex flex-wrap gap-2">
                  <PayBadge label="VISA" />
                  <PayBadge label="Mastercard" />
                  <PayBadge label="RuPay" />
                  <PayBadge label="UPI" />
                  <PayBadge label="Net Banking" />
                  <PayBadge label="COD" />
                </div>

                {/* Place Order CTA — only shown at final step */}
                <button
                  onClick={handleSubmit}
                  className="mt-4 w-full sm:w-64 py-4 bg-black text-white text-sm font-bold uppercase
                             flex items-center justify-between px-6
                             hover:bg-gray-800 active:scale-[.98] transition-all duration-150"
                >
                  Place Order
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="h-16 border border-gray-100 bg-gray-50 rounded" />
            )}
          </section>

        </div>

        {/* ════════ RIGHT: Your Cart Summary ════════ */}
        <div className="lg:w-80 xl:w-96 flex-shrink-0">
          <div className="lg:sticky lg:top-6">

            {/* Heading + Edit */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-black uppercase tracking-tight">Your Cart</h2>
              <button
                onClick={() => navigate('/cart')}
                className="text-sm underline hover:opacity-70 transition-opacity"
              >
                Edit
              </button>
            </div>

            {/* Line totals */}
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
                <span className="font-medium">{currency}{subtotal.toLocaleString('en-IN')}.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery</span>
                <span className={`font-medium ${deliveryFree ? 'text-green-600' : ''}`}>
                  {deliveryFree ? 'Free' : `${currency}99.00`}
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="border-t border-gray-200 pt-4 mb-5">
              <div className="flex justify-between items-baseline">
                <span className="font-bold">Total</span>
                <span className="font-bold text-lg">{currency}{total.toLocaleString('en-IN')}.00</span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">Inclusive of all taxes</p>
            </div>

            {/* Promo code row */}
            <div className="flex items-center justify-between py-4 border-t border-b border-gray-200 mb-5">
              <span className="text-sm font-semibold">Use points or promo code</span>
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>

            {/* Cart item list */}
            <div className="space-y-4">
              {cartData.map((item) => {
                const product = getProduct(item._id);
                if (!product) return null;
                return (
                  <div key={`${item._id}-${item.size}`} className="flex gap-4">
                    {/* Thumbnail */}
                    <div className="w-20 flex-shrink-0 bg-gray-100" style={{ aspectRatio: '3/4' }}>
                      <img
                        src={product.image?.[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Details */}
                    <div className="flex-1 text-sm">
                      <p className="font-bold uppercase leading-snug">{product.name}</p>
                      <p className="text-gray-500 mt-0.5">
                        {currency}{Number(product.price).toLocaleString('en-IN')}.00
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        Size: {item.size} / Quantity: {item.quantity}
                      </p>
                      {product.color && (
                        <p className="text-gray-500 text-xs">Colour: {product.color}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default PlaceOrder;