import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';

/* ─────────────────────────────────────────────
   Reusable labelled input field
───────────────────────────────────────────── */

const Field = ({
  label,
  required,
  hint,
  type = 'text',
  value,
  onChange,
  children
}) => (
  <div className="flex flex-col gap-1">
    <div className="relative border border-gray-300 focus-within:border-black transition-colors">

      {children ? (
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

      <label className="absolute left-3 top-1 text-[10px] text-gray-400 uppercase tracking-wide pointer-events-none">
        {label}{required && ' *'}
      </label>

    </div>

    {hint && (
      <p className="text-xs text-gray-400 pl-1">
        {hint}
      </p>
    )}
  </div>
);


/* ─────────────────────────────────────────────
   Section heading
───────────────────────────────────────────── */

const SectionHeading = ({ label, dimmed = false }) => (
  <h2
    className={`text-xl sm:text-2xl font-black uppercase tracking-tight mb-5
    ${dimmed ? 'text-gray-300' : 'text-black'}`}
  >
    {label}
  </h2>
);


/* ─────────────────────────────────────────────
   Indian states
───────────────────────────────────────────── */

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli',
  'Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
];


/* ─────────────────────────────────────────────
   Payment badge (accepted methods strip)
───────────────────────────────────────────── */

const PayBadge = ({ label }) => (
  <span className="border border-gray-300 rounded px-2 py-1 text-[10px] font-bold text-gray-600 tracking-wide">
    {label}
  </span>
);


/* ─────────────────────────────────────────────
   NEW: Payment method categories (Myntra-style
   left list). Kept in your project's own visual
   language — plain borders, no colour accents,
   uppercase/mono labels — no pink/rounded chrome.
───────────────────────────────────────────── */

const PAYMENT_METHODS = [
  { id: 'cod', label: 'Cash On Delivery' },
  { id: 'upi', label: 'UPI' },
  { id: 'card', label: 'Credit / Debit Card' },
  { id: 'netbanking', label: 'Net Banking' },
  { id: 'wallet', label: 'Wallets' },
  { id: 'paylater', label: 'Pay Later' },
];

const WALLET_OPTIONS = ['Paytm', 'PhonePe', 'Amazon Pay', 'Mobikwik'];
const BANK_OPTIONS = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra Bank'];
const PAYLATER_OPTIONS = ['Simpl', 'LazyPay'];


/* ═══════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════ */

const PlaceOrder = () => {

  const navigate = useNavigate();

  /*
    IMPORTANT:
    Make sure your ShopContext provides these values.

    If your context uses a different token variable,
    adjust it accordingly.
  */
  const {
    products = [],
    currency = '₹',
    cartItems = {},
    setCartItems,
    backendUrl,
    token,
    delivery_fee = 0
  } = useContext(ShopContext);


  /* ─────────────────────────────────────────────
     Checkout step
     
     1 = Contact + Address
     2 = Delivery + Payment
  ───────────────────────────────────────────── */

  const [step, setStep] = useState(1);


  /* ─────────────────────────────────────────────
     Delivery method
  ───────────────────────────────────────────── */

  const [deliveryMethod, setDeliveryMethod] = useState('standard');


  /* ─────────────────────────────────────────────
     Payment method
     paymentMethod now stores the selected CATEGORY
     id from PAYMENT_METHODS ('cod' | 'upi' | 'card'
     | 'netbanking' | 'wallet' | 'paylater').
  ───────────────────────────────────────────── */

  const [paymentMethod, setPaymentMethod] = useState('cod');

  // NEW: lightweight controlled state for the detail
  // panel inputs. None of these are required to place
  // an order (kept optional so existing validation /
  // order flow isn't disturbed) — they just make the
  // new UI functional rather than decorative.
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [selectedWallet, setSelectedWallet] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [selectedPayLater, setSelectedPayLater] = useState('');


  /* ─────────────────────────────────────────────
     Form
  ───────────────────────────────────────────── */

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


  /* ─────────────────────────────────────────────
     Checkboxes
  ───────────────────────────────────────────── */

  const [sameBilling, setSameBilling] = useState(true);
  const [newsletter, setNewsletter] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [placingOrder, setPlacingOrder] = useState(false);


  /* ─────────────────────────────────────────────
     Update form
  ───────────────────────────────────────────── */

  const update = (key) => (event) => {
    setForm((prev) => ({
      ...prev,
      [key]: event.target.value,
    }));
  };


  /* ─────────────────────────────────────────────
     Build cart data
  ───────────────────────────────────────────── */

  const [cartData, setCartData] = useState([]);

  useEffect(() => {

    const temp = [];

    for (const itemId in cartItems) {

      for (const size in cartItems[itemId]) {

        if (cartItems[itemId][size] > 0) {

          temp.push({
            _id: itemId,
            size,
            quantity: cartItems[itemId][size],
          });

        }
      }
    }

    setCartData(temp);

  }, [cartItems]);


  /* ─────────────────────────────────────────────
     Find product
  ───────────────────────────────────────────── */

  const getProduct = (id) => {
    return products.find((product) => product._id === id);
  };


  /* ─────────────────────────────────────────────
     Calculate subtotal
  ───────────────────────────────────────────── */

  const subtotal = cartData.reduce((total, item) => {

    const product = getProduct(item._id);

    if (!product) return total;

    return total + Number(product.price) * item.quantity;

  }, 0);


  const totalItems = cartData.reduce(
    (total, item) => total + item.quantity,
    0
  );


  /* ─────────────────────────────────────────────
     Delivery price
  ───────────────────────────────────────────── */

  const standardDelivery = subtotal > 999 ? 0 : 99;

  const selectedDeliveryPrice =
    deliveryMethod === 'express'
      ? 199
      : standardDelivery;


  const total = subtotal + selectedDeliveryPrice;


  /* ─────────────────────────────────────────────
     Validate address
  ───────────────────────────────────────────── */

  const handleNext = () => {

    const requiredFields = [
      'email',
      'firstName',
      'lastName',
      'street',
      'city',
      'state',
      'pinCode',
      'mobile'
    ];

    const missingFields = requiredFields.filter(
      (field) => !form[field].trim()
    );


    if (missingFields.length > 0) {

      toast.error(
        'Please fill all required contact and address fields.'
      );

      return;
    }


    if (!termsAccepted) {

      toast.error(
        'Please accept the Terms & Conditions and Privacy Policy.'
      );

      return;
    }


    /*
      IMPORTANT:
      This button is type="button", so there is
      NO browser form submission / page refresh.
    */

    setStep(2);


    setTimeout(() => {

      document
        .getElementById('delivery-section')
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

    }, 100);

  };


  /* ─────────────────────────────────────────────
     Place order
  ───────────────────────────────────────────── */

  const handlePlaceOrder = async () => {

    if (cartData.length === 0) {

      toast.error('Your cart is empty.');

      return;
    }


    if (!termsAccepted) {

      toast.error(
        'Please accept the Terms & Conditions.'
      );

      return;
    }


    setPlacingOrder(true);


    try {

      /* Build order items */

      const orderItems = [];

      for (const itemId in cartItems) {

        for (const size in cartItems[itemId]) {

          const quantity = cartItems[itemId][size];

          if (quantity > 0) {

            const product = products.find(
              (product) => product._id === itemId
            );

            if (product) {

              orderItems.push({
                ...product,
                size,
                quantity
              });

            }
          }
        }
      }


      /* Order payload */

      const orderData = {

        address: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          street: form.street,
          landmark: form.landmark,
          additionalInfo: form.additionalInfo,
          city: form.city,
          state: form.state,
          pinCode: form.pinCode,
          mobile: form.mobile,
          country: 'India'
        },

        items: orderItems,

        amount: total,

        deliveryMethod,

        paymentMethod,

        deliveryFee: selectedDeliveryPrice,

        newsletter,
        sameBilling
      };


      console.log('ORDER DATA:', orderData);


      /* ─────────────────────────────────────────
         Backend API
      ───────────────────────────────────────── */

      if (!backendUrl) {

        toast.error(
          'Backend URL is not configured.'
        );

        return;
      }


      // FIX: was `/api/orders/place` (plural) — your server mounts the
      // order router at the singular `/api/order`, so the plural path
      // 404'd on every attempt. Changed to match the actual route.
      const response = await axios.post(
        `${backendUrl}/api/order/place`,
        orderData,
        {
          headers: {
            token
          }
        }
      );


      if (response.data.success) {

        toast.success(
          'Order placed successfully!'
        );


        /*
          Clear cart only AFTER backend
          confirms successful order.
        */

        setCartItems({});


        navigate('/orders');

      } else {

        toast.error(
          response.data.message || 'Failed to place order.'
        );

      }

    } catch (error) {

      console.error('PLACE ORDER ERROR:', error);

      toast.error(
        error.response?.data?.message ||
        error.message ||
        'Something went wrong while placing your order.'
      );

    } finally {

      setPlacingOrder(false);

    }

  };


  /* ─────────────────────────────────────────────
     Empty cart
  ───────────────────────────────────────────── */

  if (cartData.length === 0) {

    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">

        <h2 className="text-2xl font-bold uppercase">
          Your bag is empty
        </h2>

        <p className="text-gray-500">
          Add some products before checking out.
        </p>

        <button
          type="button"
          onClick={() => navigate('/')}
          className="px-8 py-3 bg-black text-white"
        >
          Continue Shopping
        </button>

      </div>
    );
  }


  return (

    /*
      IMPORTANT:
      We use a DIV instead of FORM.

      This checkout is controlled by React steps,
      not by native HTML form submission.
    */

    <div className="max-w-screen-xl mx-auto px-4 sm:px-8 py-8">


      {/* ═══════════════════════════════════════
          PAGE HEADER
      ═══════════════════════════════════════ */}

      <div className="text-center mb-10 border-b border-gray-200 pb-6">

        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
          Checkout
        </h1>

        <p className="text-sm text-gray-500 mt-1">

          ({totalItems} {totalItems === 1 ? 'item' : 'items'})

          &nbsp;

          {currency}
          {total.toLocaleString('en-IN')}.00

        </p>

      </div>


      {/* ═══════════════════════════════════════
          TWO COLUMN LAYOUT
      ═══════════════════════════════════════ */}

      <div className="flex flex-col lg:flex-row gap-12">


        {/* ═══════════════════════════════════
            LEFT SIDE
        ═══════════════════════════════════ */}

        <div className="flex-1 min-w-0 space-y-12">


          {/* ───────────────────────────────
              CONTACT
          ─────────────────────────────── */}

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


          {/* ───────────────────────────────
              ADDRESS
          ─────────────────────────────── */}

          <section>

            <SectionHeading label="Address" />

            <p className="text-sm font-semibold mb-4">
              Delivery address
            </p>


            <div className="space-y-4">


              {/* Name */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <Field
                  label="First Name"
                  required
                  value={form.firstName}
                  onChange={update('firstName')}
                />

                <Field
                  label="Last Name"
                  required
                  value={form.lastName}
                  onChange={update('lastName')}
                />

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
                value={form.landmark}
                onChange={update('landmark')}
              />


              {/* Additional + City */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <Field
                  label="Additional Info"
                  value={form.additionalInfo}
                  onChange={update('additionalInfo')}
                />

                <Field
                  label="City"
                  required
                  value={form.city}
                  onChange={update('city')}
                />

              </div>


              {/* State + Pin */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">


                <Field label="State" required>

                  <select
                    value={form.state}
                    onChange={update('state')}
                    className="w-full px-3 pt-5 pb-2 text-sm bg-transparent focus:outline-none appearance-none cursor-pointer"
                  >

                    <option value="" disabled>
                      Select state
                    </option>

                    {INDIAN_STATES.map((state) => (

                      <option
                        key={state}
                        value={state}
                      >
                        {state}
                      </option>

                    ))}

                  </select>

                  <svg
                    className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />

                  </svg>

                </Field>


                <Field
                  label="Pin Code"
                  required
                  type="text"
                  value={form.pinCode}
                  onChange={update('pinCode')}
                />

              </div>


              {/* Country */}

              <p className="text-sm pl-1">

                <span className="font-semibold">
                  Country:
                </span>{' '}
                India

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


            {/* ═══════════════════════════════
                CHECKBOXES
            ═══════════════════════════════ */}

            <div className="mt-6 space-y-4">


              {/* Billing */}

              <label className="flex items-start gap-3 cursor-pointer select-none">

                <input
                  type="checkbox"
                  checked={sameBilling}
                  onChange={() => setSameBilling(!sameBilling)}
                  className="mt-0.5 w-4 h-4 accent-black flex-shrink-0"
                />

                <span className="text-sm">
                  My billing and delivery information are the same.
                </span>

              </label>


              {/* Newsletter */}

              <label className="flex items-start gap-3 cursor-pointer select-none">

                <input
                  type="checkbox"
                  checked={newsletter}
                  onChange={() => setNewsletter(!newsletter)}
                  className="mt-0.5 w-4 h-4 accent-black flex-shrink-0"
                />

                <span className="text-sm">

                  I would like to stay up to date with KalaSetu.

                  <button
                    type="button"
                    className="ml-1 underline hover:opacity-70"
                  >
                    Read more
                  </button>

                </span>

              </label>


              {/* Terms */}

              <label className="flex items-start gap-3 cursor-pointer select-none">

                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={() => setTermsAccepted(!termsAccepted)}
                  className="mt-0.5 w-4 h-4 accent-black flex-shrink-0"
                />

                <span className="text-sm">

                  Yes, I am over 18 years old & accept the{' '}

                  <button
                    type="button"
                    className="underline hover:opacity-70"
                  >
                    Terms & Conditions
                  </button>

                  {' '}and{' '}

                  <button
                    type="button"
                    className="underline hover:opacity-70"
                  >
                    Privacy Policy
                  </button>

                  .

                  {' '}

                  <span className="text-red-500">
                    *
                  </span>

                </span>

              </label>

            </div>


            {/* ═══════════════════════════════
                NEXT BUTTON
            ═══════════════════════════════ */}

            {step === 1 && (

              <button
                type="button"
                onClick={handleNext}
                className="mt-6 w-full sm:w-64 py-4 bg-black text-white text-sm font-bold uppercase
                           flex items-center justify-between px-6
                           hover:bg-gray-800 active:scale-[.98] transition-all duration-150"
              >

                Next

                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />

                </svg>

              </button>

            )}

          </section>


          {/* ═══════════════════════════════════
              DELIVERY
          ═══════════════════════════════════ */}

          <hr className="border-gray-200" />


          <section id="delivery-section">

            <SectionHeading
              label="Delivery Options"
              dimmed={step < 2}
            />


            {step >= 2 ? (

              <div className="space-y-3">


                {/* STANDARD */}

                <label className="flex items-center justify-between border border-gray-300 p-4 cursor-pointer hover:border-black transition-colors">

                  <div className="flex items-center gap-3">

                    <input
                      type="radio"
                      name="delivery"
                      value="standard"
                      checked={deliveryMethod === 'standard'}
                      onChange={(e) => setDeliveryMethod(e.target.value)}
                      className="accent-black"
                    />

                    <div>

                      <p className="text-sm font-semibold">
                        Standard Delivery
                      </p>

                      <p className="text-xs text-gray-500">
                        3–5 business days
                      </p>

                    </div>

                  </div>


                  <span className="text-sm font-semibold">

                    {standardDelivery === 0
                      ? 'Free'
                      : `${currency}99`}

                  </span>

                </label>


                {/* EXPRESS */}

                <label className="flex items-center justify-between border border-gray-300 p-4 cursor-pointer hover:border-black transition-colors">

                  <div className="flex items-center gap-3">

                    <input
                      type="radio"
                      name="delivery"
                      value="express"
                      checked={deliveryMethod === 'express'}
                      onChange={(e) => setDeliveryMethod(e.target.value)}
                      className="accent-black"
                    />

                    <div>

                      <p className="text-sm font-semibold">
                        Express Delivery
                      </p>

                      <p className="text-xs text-gray-500">
                        1–2 business days
                      </p>

                    </div>

                  </div>


                  <span className="text-sm font-semibold">
                    {currency}199
                  </span>

                </label>

              </div>

            ) : (

              <div className="h-16 border border-gray-100 bg-gray-50 rounded" />

            )}

          </section>


          {/* ═══════════════════════════════════
              PAYMENT
              NEW: Myntra-style two-column browser
              (left category list / right detail
              panel), rebuilt in the project's own
              plain-border, no-colour visual style.
          ═══════════════════════════════════ */}

          <hr className="border-gray-200" />


          <section>

            <SectionHeading
              label="Payment"
              dimmed={step < 2}
            />


            {step >= 2 ? (

              <div className="space-y-5">

                <p className="text-sm text-gray-600">
                  Choose payment mode.
                </p>


                {/* ── Category list + detail panel ── */}

                <div className="flex flex-col sm:flex-row border border-gray-300">


                  {/* LEFT: category list */}

                  <div className="sm:w-56 flex-shrink-0 divide-y divide-gray-200 border-b sm:border-b-0 sm:border-r border-gray-300">

                    {PAYMENT_METHODS.map((method) => {

                      const active = paymentMethod === method.id;

                      return (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setPaymentMethod(method.id)}
                          className={`w-full flex items-center gap-2 text-left px-4 py-4 text-sm font-medium
                                      transition-colors border-l-2
                                      ${active
                                        ? 'border-black bg-gray-50 text-black'
                                        : 'border-transparent text-gray-600 hover:bg-gray-50'}`}
                        >
                          {method.label}
                        </button>
                      );

                    })}

                  </div>


                  {/* RIGHT: detail panel for the selected category */}

                  <div className="flex-1 p-6 min-h-[220px]">


                    {/* CASH ON DELIVERY */}

                    {paymentMethod === 'cod' && (

                      <div>

                        <p className="text-sm font-bold uppercase tracking-wide mb-4">
                          Cash On Delivery
                        </p>

                        <label className="flex items-center gap-3 border border-gray-300 p-4 cursor-pointer hover:border-black transition-colors">

                          <input
                            type="radio"
                            checked
                            readOnly
                            className="accent-black"
                          />

                          <span className="text-sm font-semibold">
                            Cash on Delivery (Cash / UPI)
                          </span>

                        </label>

                        <p className="text-xs text-gray-400 mt-3">
                          Pay when your order arrives at your doorstep.
                        </p>

                      </div>

                    )}


                    {/* UPI */}

                    {paymentMethod === 'upi' && (

                      <div>

                        <p className="text-sm font-bold uppercase tracking-wide mb-4">
                          Pay Using UPI
                        </p>

                        <label className="flex items-center gap-3 border border-gray-300 p-4 cursor-pointer hover:border-black transition-colors mb-4">

                          <input
                            type="radio"
                            checked
                            readOnly
                            className="accent-black"
                          />

                          <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                              d="M3.75 4.5h4.5v4.5h-4.5v-4.5zM15.75 4.5h4.5v4.5h-4.5v-4.5zM3.75 15h4.5v4.5h-4.5V15zM15.75 15h4.5v4.5h-4.5V15zM10.5 6h3M10.5 18h3M6 10.5v3M18 10.5v3" />
                          </svg>

                          <span className="text-sm font-semibold">
                            Scan & Pay
                          </span>

                        </label>

                        <Field
                          label="UPI ID"
                          hint="E.g. yourname@upi"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                        />

                      </div>

                    )}


                    {/* CREDIT / DEBIT CARD */}

                    {paymentMethod === 'card' && (

                      <div className="space-y-4">

                        <p className="text-sm font-bold uppercase tracking-wide">
                          Credit / Debit Card
                        </p>

                        <Field
                          label="Card Number"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                        />

                        <div className="grid grid-cols-2 gap-4">

                          <Field
                            label="Valid Thru (MM/YY)"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                          />

                          <Field
                            label="CVV"
                            type="password"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                          />

                        </div>

                        <p className="text-xs text-gray-400">
                          Please ensure your card can be used for online transactions.
                        </p>

                      </div>

                    )}


                    {/* NET BANKING */}

                    {paymentMethod === 'netbanking' && (

                      <div>

                        <p className="text-sm font-bold uppercase tracking-wide mb-4">
                          Net Banking
                        </p>

                        <div className="space-y-3">

                          {BANK_OPTIONS.map((bank) => (

                            <label
                              key={bank}
                              className="flex items-center gap-3 border border-gray-300 p-3 cursor-pointer hover:border-black transition-colors"
                            >

                              <input
                                type="radio"
                                name="bank"
                                value={bank}
                                checked={selectedBank === bank}
                                onChange={(e) => setSelectedBank(e.target.value)}
                                className="accent-black"
                              />

                              <span className="text-sm">
                                {bank}
                              </span>

                            </label>

                          ))}

                        </div>

                      </div>

                    )}


                    {/* WALLETS */}

                    {paymentMethod === 'wallet' && (

                      <div>

                        <p className="text-sm font-bold uppercase tracking-wide mb-4">
                          Wallets
                        </p>

                        <div className="space-y-3">

                          {WALLET_OPTIONS.map((wallet) => (

                            <label
                              key={wallet}
                              className="flex items-center gap-3 border border-gray-300 p-3 cursor-pointer hover:border-black transition-colors"
                            >

                              <input
                                type="radio"
                                name="wallet"
                                value={wallet}
                                checked={selectedWallet === wallet}
                                onChange={(e) => setSelectedWallet(e.target.value)}
                                className="accent-black"
                              />

                              <span className="text-sm">
                                {wallet}
                              </span>

                            </label>

                          ))}

                        </div>

                      </div>

                    )}


                    {/* PAY LATER */}

                    {paymentMethod === 'paylater' && (

                      <div>

                        <p className="text-sm font-bold uppercase tracking-wide mb-4">
                          Pay Later
                        </p>

                        <div className="space-y-3">

                          {PAYLATER_OPTIONS.map((option) => (

                            <label
                              key={option}
                              className="flex items-center gap-3 border border-gray-300 p-3 cursor-pointer hover:border-black transition-colors"
                            >

                              <input
                                type="radio"
                                name="paylater"
                                value={option}
                                checked={selectedPayLater === option}
                                onChange={(e) => setSelectedPayLater(e.target.value)}
                                className="accent-black"
                              />

                              <span className="text-sm">
                                {option}
                              </span>

                            </label>

                          ))}

                        </div>

                      </div>

                    )}

                  </div>

                </div>


                {/* Accepted methods strip — unchanged from before */}

                <div className="flex flex-wrap gap-2">

                  <PayBadge label="VISA" />
                  <PayBadge label="Mastercard" />
                  <PayBadge label="RuPay" />
                  <PayBadge label="UPI" />
                  <PayBadge label="Net Banking" />
                  <PayBadge label="COD" />

                </div>


                {/* PLACE ORDER */}

                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={placingOrder}
                  className="mt-4 w-full sm:w-64 py-4 bg-black text-white text-sm font-bold uppercase
                             flex items-center justify-between px-6
                             hover:bg-gray-800 active:scale-[.98] transition-all duration-150
                             disabled:opacity-50 disabled:cursor-not-allowed"
                >

                  {placingOrder
                    ? 'Placing Order...'
                    : 'Place Order'}

                  {!placingOrder && (

                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />

                    </svg>

                  )}

                </button>

              </div>

            ) : (

              <div className="h-16 border border-gray-100 bg-gray-50 rounded" />

            )}

          </section>

        </div>


        {/* ═══════════════════════════════════
            RIGHT: CART SUMMARY
        ═══════════════════════════════════ */}

        <div className="lg:w-80 xl:w-96 flex-shrink-0">

          <div className="lg:sticky lg:top-6">


            {/* Header */}

            <div className="flex items-center justify-between mb-5">

              <h2 className="text-xl font-black uppercase tracking-tight">
                Your Cart
              </h2>

              <button
                type="button"
                onClick={() => navigate('/cart')}
                className="text-sm underline hover:opacity-70"
              >
                Edit
              </button>

            </div>


            {/* Summary */}

            <div className="space-y-2 text-sm mb-4">

              <div className="flex justify-between">

                <span className="text-gray-600">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </span>

                <span className="font-medium">

                  {currency}
                  {subtotal.toLocaleString('en-IN')}.00

                </span>

              </div>


              <div className="flex justify-between">

                <span className="text-gray-600">
                  Delivery
                </span>

                <span
                  className={`font-medium ${
                    selectedDeliveryPrice === 0
                      ? 'text-green-600'
                      : ''
                  }`}
                >

                  {selectedDeliveryPrice === 0
                    ? 'Free'
                    : `${currency}${selectedDeliveryPrice}.00`}

                </span>

              </div>

            </div>


            {/* Total */}

            <div className="border-t border-gray-200 pt-4 mb-5">

              <div className="flex justify-between items-baseline">

                <span className="font-bold">
                  Total
                </span>

                <span className="font-bold text-lg">

                  {currency}
                  {total.toLocaleString('en-IN')}.00

                </span>

              </div>

              <p className="text-xs text-gray-400 mt-0.5">
                Inclusive of all taxes
              </p>

            </div>


            {/* Promo */}

            <div className="flex items-center justify-between py-4 border-t border-b border-gray-200 mb-5">

              <span className="text-sm font-semibold">
                Use points or promo code
              </span>

              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7-7"
                />

              </svg>

            </div>


            {/* Cart items */}

            <div className="space-y-4">

              {cartData.map((item) => {

                const product = getProduct(item._id);

                if (!product) return null;

                return (

                  <div
                    key={`${item._id}-${item.size}`}
                    className="flex gap-4"
                  >

                    <div
                      className="w-20 flex-shrink-0 bg-gray-100"
                      style={{ aspectRatio: '3/4' }}
                    >

                      <img
                        src={product.images?.[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />

                    </div>


                    <div className="flex-1 text-sm">

                      <p className="font-bold uppercase leading-snug">
                        {product.name}
                      </p>

                      <p className="text-gray-500 mt-0.5">

                        {currency}
                        {Number(product.price).toLocaleString('en-IN')}.00

                      </p>

                      <p className="text-gray-500 text-xs mt-1">

                        Size: {item.size} / Quantity: {item.quantity}

                      </p>

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
