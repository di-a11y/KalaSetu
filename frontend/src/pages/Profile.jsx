import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';

/* ════════════════════════════════════════════════════
   DESIGN TOKENS  — KalaSetu palette
════════════════════════════════════════════════════ */
const T = {
  pageBg:   '#fdf8ed',
  inputBg:  '#f5eedc',
  border:   '#c9a96e',
  gold:     '#d4b483',
  goldDark: '#8b6914',
  text:     '#2c1a0e',
  sub:      '#7a5c3a',
  muted:    '#9a7d50',
};

/* ════════════════════════════════════════════════════
   SIDEBAR NAV CONFIG
════════════════════════════════════════════════════ */
const NAV = [
  {
    group: null,
    items: [{ id: 'overview', label: 'Overview' }],
  },
  {
    group: 'MY ORDERS',
    items: [{ id: 'orders', label: 'Orders & Returns' }],
  },
  {
    group: 'ACCOUNT',
    items: [
      { id: 'profile',   label: 'Profile Details' },
      { id: 'addresses', label: 'Saved Addresses' },
    ],
  },
  {
    group: 'PREFERENCES',
    items: [
      { id: 'crafts',     label: 'Craft Preferences' },
      { id: 'newsletter', label: 'Newsletter Settings' },
    ],
  },
  {
    group: 'LEGAL',
    items: [{ id: 'logout', label: 'Logout', danger: true }],
  },
];

/* ════════════════════════════════════════════════════
   SHARED ATOMS
════════════════════════════════════════════════════ */

/* Floating-label input — matches PlaceOrder.jsx */
const Field = ({ label, type = 'text', value, onChange, disabled, required }) => (
  <div className="relative border focus-within:border-black transition-colors"
    style={{ borderColor: T.border }}>
    <input
      type={type}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      placeholder=" "
      className="peer w-full px-3 pt-5 pb-2 text-sm bg-transparent focus:outline-none
                 disabled:cursor-not-allowed disabled:opacity-70"
      style={{ color: T.text, background: disabled ? T.inputBg : 'white' }}
    />
    <label className="absolute left-3 top-1 text-[10px] uppercase tracking-wide pointer-events-none"
      style={{ color: T.muted }}>
      {label}{required && ' *'}
    </label>
  </div>
);

const SelectField = ({ label, value, onChange, disabled, options }) => (
  <div className="relative border focus-within:border-black transition-colors"
    style={{ borderColor: T.border }}>
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full px-3 pt-5 pb-2 text-sm bg-transparent focus:outline-none appearance-none
                 disabled:cursor-not-allowed disabled:opacity-70"
      style={{ color: T.text, background: disabled ? T.inputBg : 'white' }}
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
    <label className="absolute left-3 top-1 text-[10px] uppercase tracking-wide pointer-events-none"
      style={{ color: T.muted }}>
      {label}
    </label>
    <svg className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
      fill="none" stroke={T.muted} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </div>
);

/* Gold primary button */
const GoldBtn = ({ children, onClick, type = 'button', disabled = false, outline = false }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className="px-6 py-2.5 text-sm font-semibold transition-all duration-200
               active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed"
    style={{
      background: outline ? 'transparent' : T.gold,
      border: `1px solid ${T.border}`,
      color: T.text,
    }}
    onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = T.goldDark; e.currentTarget.style.color = 'white'; }}
    onMouseLeave={e => { e.currentTarget.style.background = outline ? 'transparent' : T.gold; e.currentTarget.style.color = T.text; }}
  >
    {children}
  </button>
);

/* Row in the profile details view */
const ProfileRow = ({ label, value }) => (
  <div className="flex items-start py-4" style={{ borderBottom: `1px solid ${T.border}20` }}>
    <span className="w-44 text-sm flex-shrink-0" style={{ color: T.sub }}>{label}</span>
    <span className="text-sm font-medium flex-1"
      style={{ color: value && value !== '- not added -' ? T.text : T.muted }}>
      {value || '- not added -'}
    </span>
  </div>
);

/* Status badge for orders */
const STATUS_COLORS = {
  'Order Placed':     { bg: '#eff6ff', color: '#1d4ed8', dot: '#3b82f6' },
  'Packing':          { bg: '#fefce8', color: '#854d0e', dot: '#eab308' },
  'Shipped':          { bg: '#f0fdf4', color: '#166534', dot: '#22c55e' },
  'Out for Delivery': { bg: '#fff7ed', color: '#9a3412', dot: '#f97316' },
  'Delivered':        { bg: '#f0fdf4', color: '#14532d', dot: '#16a34a' },
};
const StatusBadge = ({ status }) => {
  const s = STATUS_COLORS[status] || { bg: T.inputBg, color: T.sub, dot: T.gold };
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{ background: s.bg, color: s.color }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
      {status}
    </span>
  );
};

/* Section card wrapper */
const Panel = ({ children }) => (
  <div className="rounded-2xl p-6 sm:p-8 flex-1"
    style={{ background: 'white', border: `1px solid ${T.border}` }}>
    {children}
  </div>
);

/* Panel heading */
const PanelTitle = ({ title, sub }) => (
  <div className="mb-6 pb-4" style={{ borderBottom: `1px solid ${T.border}` }}>
    <h2 className="text-xl font-bold" style={{ color: T.text }}>{title}</h2>
    {sub && <p className="text-xs mt-0.5" style={{ color: T.sub }}>{sub}</p>}
  </div>
);

/* Craft chip toggle */
const CraftChip = ({ label, selected, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 active:scale-95"
    style={{
      background: selected ? T.gold : T.inputBg,
      border: `1.5px solid ${selected ? T.goldDark : T.border}`,
      color: selected ? T.text : T.sub,
    }}
  >
    {label}
  </button>
);


/* ════════════════════════════════════════════════════
   SECTION: OVERVIEW
════════════════════════════════════════════════════ */
const OverviewSection = ({ profile, orders, setActive }) => {
  const stats = [
    { label: 'Orders Placed', value: orders.length, section: 'orders', icon: '📦' },
    { label: 'Craft Interests', value: profile.craftPrefs?.length || 0, section: 'crafts', icon: '🎨' },
    { label: 'Saved Addresses', value: profile.addresses?.length || 0, section: 'addresses', icon: '📍' },
  ];

  return (
    <Panel>
      <PanelTitle title="Overview" sub={`Hello${profile.firstName ? ', ' + profile.firstName : ''}! Welcome to your KalaSetu account.`} />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map(s => (
          <button key={s.label} onClick={() => setActive(s.section)}
            className="flex flex-col items-center justify-center py-6 rounded-xl gap-1 transition-all duration-200 hover:shadow-md active:scale-[.98]"
            style={{ background: T.inputBg, border: `1px solid ${T.border}` }}>
            <span className="text-2xl">{s.icon}</span>
            <span className="text-2xl font-bold" style={{ color: T.text }}>{s.value}</span>
            <span className="text-xs" style={{ color: T.sub }}>{s.label}</span>
          </button>
        ))}
      </div>

      {/* Quick links */}
      <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: T.goldDark }}>Quick Links</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { label: 'View my orders', section: 'orders' },
          { label: 'Edit profile details', section: 'profile' },
          { label: 'Manage addresses', section: 'addresses' },
          { label: 'Update craft preferences', section: 'crafts' },
        ].map(l => (
          <button key={l.label} onClick={() => setActive(l.section)}
            className="flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium text-left transition-all duration-150 hover:shadow-sm"
            style={{ background: T.inputBg, border: `1px solid ${T.border}`, color: T.text }}>
            {l.label}
            <svg className="w-4 h-4" fill="none" stroke={T.muted} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>

      {/* Tagline */}
      <div className="mt-8 rounded-xl px-4 py-3 text-center text-sm italic"
        style={{ background: T.inputBg, color: T.sub, fontFamily: 'Georgia, serif' }}>
        Every Purchase Preserves a Tradition.
      </div>
    </Panel>
  );
};


/* ════════════════════════════════════════════════════
   SECTION: PROFILE DETAILS
════════════════════════════════════════════════════ */
const ProfileSection = ({ profile, setProfile, backendUrl, token }) => {
  const [editing, setEditing] = useState(false);
  const [draft,   setDraft]   = useState({ ...profile });
  const [saving,  setSaving]  = useState(false);

  const upd = key => e => setDraft(d => ({ ...d, [key]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      // TODO: POST /api/user/profile  →  { success, message }
      // const response = await axios.post(backendUrl + '/api/user/profile', draft, { headers: { token } });
      // For now, persist in localStorage until backend is ready:
      const updated = { ...profile, ...draft };
      localStorage.setItem('ks_profile', JSON.stringify(updated));
      setProfile(updated);
      setEditing(false);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => { setDraft({ ...profile }); setEditing(false); };

  return (
    <Panel>
      <PanelTitle title="Profile Details" sub="Your personal information" />

      {!editing ? (
        <>
          <ProfileRow label="Full Name"    value={`${profile.firstName || ''} ${profile.lastName || ''}`.trim()} />
          <ProfileRow label="Email ID"     value={profile.email} />
          <ProfileRow label="Mobile Number"value={profile.mobile} />
          <ProfileRow label="Gender"       value={profile.gender} />
          <ProfileRow label="Date of Birth"value={profile.dob} />
          <ProfileRow label="City"         value={profile.city} />
          <ProfileRow label="Bio"          value={profile.bio} />

          <div className="mt-6">
            <GoldBtn onClick={() => { setDraft({ ...profile }); setEditing(true); }}>
              Edit Profile
            </GoldBtn>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="First Name" value={draft.firstName} onChange={upd('firstName')} />
            <Field label="Last Name"  value={draft.lastName}  onChange={upd('lastName')} />
          </div>
          <Field label="Email ID" type="email" value={draft.email} onChange={upd('email')} />
          <Field label="Mobile Number" type="tel" value={draft.mobile} onChange={upd('mobile')} />
          <SelectField
            label="Gender"
            value={draft.gender}
            onChange={upd('gender')}
            options={[
              { value: '', label: 'Select gender' },
              { value: 'Female', label: 'Female' },
              { value: 'Male', label: 'Male' },
              { value: 'Non-binary', label: 'Non-binary' },
              { value: 'Prefer not to say', label: 'Prefer not to say' },
            ]}
          />
          <Field label="Date of Birth" type="date" value={draft.dob} onChange={upd('dob')} />
          <Field label="City" value={draft.city} onChange={upd('city')} />
          <div className="relative border focus-within:border-black transition-colors"
            style={{ borderColor: T.border }}>
            <textarea
              value={draft.bio}
              onChange={upd('bio')}
              placeholder=" "
              rows={3}
              className="peer w-full px-3 pt-5 pb-2 text-sm bg-white focus:outline-none resize-none"
              style={{ color: T.text }}
            />
            <label className="absolute left-3 top-1 text-[10px] uppercase tracking-wide pointer-events-none"
              style={{ color: T.muted }}>
              About Me (optional)
            </label>
          </div>

          <div className="flex gap-3 mt-2">
            <GoldBtn onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save Changes'}
            </GoldBtn>
            <GoldBtn outline onClick={handleCancel}>Cancel</GoldBtn>
          </div>
        </div>
      )}
    </Panel>
  );
};


/* ════════════════════════════════════════════════════
   SECTION: MY ORDERS
════════════════════════════════════════════════════ */
const OrdersSection = ({ backendUrl, token, currency }) => {
  const navigate   = useNavigate();
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await axios.post(
          backendUrl + '/api/order/userorders', {},
          { headers: { token } }
        );
        if (res.data.success) {
          setOrders([...res.data.orders].sort((a, b) => b.date - a.date));
        } else {
          toast.error(res.data.message);
        }
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetch();
    else setLoading(false);
  }, [token]);

  const fmt = ts => ts ? new Date(ts).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

  return (
    <Panel>
      <PanelTitle title="Orders & Returns"
        sub={loading ? 'Loading…' : `${orders.length} order${orders.length !== 1 ? 's' : ''} placed`} />

      {loading && (
        <div className="flex flex-col gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 rounded-xl animate-pulse" style={{ background: T.inputBg }} />
          ))}
        </div>
      )}

      {!loading && orders.length === 0 && (
        <div className="flex flex-col items-center py-16 gap-4 text-center">
          <span className="text-5xl">📦</span>
          <p className="text-sm font-medium" style={{ color: T.sub }}>No orders yet.</p>
          <GoldBtn onClick={() => navigate('/')}>Start Shopping</GoldBtn>
        </div>
      )}

      {!loading && orders.length > 0 && (
        <div className="flex flex-col gap-4">
          {orders.map(order => (
            <div key={order._id} className="rounded-xl overflow-hidden"
              style={{ border: `1px solid ${T.border}` }}>

              {/* Header */}
              <div className="flex items-center justify-between px-4 py-2.5 flex-wrap gap-2"
                style={{ background: T.inputBg, borderBottom: `1px solid ${T.border}` }}>
                <div>
                  <p className="text-xs font-bold" style={{ color: T.text }}>
                    Order #{order._id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-[10px]" style={{ color: T.muted }}>Placed on {fmt(order.date)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={order.status} />
                  <span className="text-xs font-bold" style={{ color: T.text }}>
                    {currency}{Number(order.amount).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="px-4 py-3 flex gap-2 flex-wrap">
                {order.items?.slice(0, 3).map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0"
                      style={{ border: `1px solid ${T.border}` }}>
                      <img src={item.image?.[0] || item.images?.[0]} alt={item.name}
                        className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-xs font-medium" style={{ color: T.text }}>{item.name}</p>
                      <p className="text-[10px]" style={{ color: T.muted }}>
                        Qty {item.quantity}{item.size ? ` · ${item.size}` : ''}
                      </p>
                    </div>
                  </div>
                ))}
                {order.items?.length > 3 && (
                  <span className="text-xs self-center" style={{ color: T.muted }}>
                    +{order.items.length - 3} more
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
};


/* ════════════════════════════════════════════════════
   SECTION: SAVED ADDRESSES
════════════════════════════════════════════════════ */
const AddressSection = ({ profile, setProfile }) => {
  const [adding,   setAdding]   = useState(false);
  const [newAddr,  setNewAddr]  = useState({ label: 'Home', name: '', phone: '', street: '', city: '', state: '', pincode: '' });
  const upd = k => e => setNewAddr(d => ({ ...d, [k]: e.target.value }));

  const addresses = profile.addresses || [];

  const addAddress = () => {
    if (!newAddr.name || !newAddr.street || !newAddr.city) {
      toast.error('Please fill required address fields.'); return;
    }
    const updated = { ...profile, addresses: [...addresses, { ...newAddr, id: Date.now() }] };
    localStorage.setItem('ks_profile', JSON.stringify(updated));
    setProfile(updated);
    setAdding(false);
    setNewAddr({ label: 'Home', name: '', phone: '', street: '', city: '', state: '', pincode: '' });
    toast.success('Address saved!');
  };

  const removeAddress = id => {
    const updated = { ...profile, addresses: addresses.filter(a => a.id !== id) };
    localStorage.setItem('ks_profile', JSON.stringify(updated));
    setProfile(updated);
    toast.success('Address removed.');
  };

  return (
    <Panel>
      <div className="flex items-center justify-between mb-6 pb-4" style={{ borderBottom: `1px solid ${T.border}` }}>
        <div>
          <h2 className="text-xl font-bold" style={{ color: T.text }}>Saved Addresses</h2>
          <p className="text-xs mt-0.5" style={{ color: T.sub }}>{addresses.length} address{addresses.length !== 1 ? 'es' : ''} saved</p>
        </div>
        {!adding && <GoldBtn onClick={() => setAdding(true)}>+ Add New</GoldBtn>}
      </div>

      {adding && (
        <div className="rounded-xl p-5 mb-5 flex flex-col gap-3"
          style={{ background: T.inputBg, border: `1px solid ${T.border}` }}>
          <p className="text-sm font-bold" style={{ color: T.text }}>New Address</p>
          <div className="grid grid-cols-2 gap-3">
            {['Home', 'Work', 'Other'].map(l => (
              <button key={l} type="button" onClick={() => setNewAddr(d => ({ ...d, label: l }))}
                className="py-1.5 text-xs font-semibold rounded transition-all"
                style={{
                  background: newAddr.label === l ? T.gold : 'white',
                  border: `1px solid ${T.border}`, color: T.text,
                }}>
                {l}
              </button>
            ))}
          </div>
          <Field label="Full Name *" value={newAddr.name} onChange={upd('name')} />
          <Field label="Phone Number" type="tel" value={newAddr.phone} onChange={upd('phone')} />
          <Field label="Street Address *" value={newAddr.street} onChange={upd('street')} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="City *" value={newAddr.city} onChange={upd('city')} />
            <Field label="Pincode" value={newAddr.pincode} onChange={upd('pincode')} />
          </div>
          <Field label="State" value={newAddr.state} onChange={upd('state')} />
          <div className="flex gap-3">
            <GoldBtn onClick={addAddress}>Save Address</GoldBtn>
            <GoldBtn outline onClick={() => setAdding(false)}>Cancel</GoldBtn>
          </div>
        </div>
      )}

      {addresses.length === 0 && !adding && (
        <div className="flex flex-col items-center py-12 gap-3 text-center">
          <span className="text-4xl">📍</span>
          <p className="text-sm" style={{ color: T.sub }}>No saved addresses yet.</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {addresses.map(addr => (
          <div key={addr.id} className="rounded-xl p-4 flex items-start justify-between gap-4"
            style={{ background: T.inputBg, border: `1px solid ${T.border}` }}>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                  style={{ background: T.gold, color: T.text }}>{addr.label}</span>
              </div>
              <p className="text-sm font-semibold" style={{ color: T.text }}>{addr.name}</p>
              <p className="text-xs mt-0.5" style={{ color: T.sub }}>{addr.street}, {addr.city}</p>
              {addr.state && <p className="text-xs" style={{ color: T.sub }}>{addr.state} – {addr.pincode}</p>}
              {addr.phone && <p className="text-xs mt-1" style={{ color: T.muted }}>📞 {addr.phone}</p>}
            </div>
            <button onClick={() => removeAddress(addr.id)}
              className="text-xs underline hover:opacity-70 flex-shrink-0 transition-opacity"
              style={{ color: '#991b1b' }}>
              Remove
            </button>
          </div>
        ))}
      </div>
    </Panel>
  );
};


/* ════════════════════════════════════════════════════
   SECTION: CRAFT PREFERENCES  (KalaSetu-specific)
════════════════════════════════════════════════════ */
const CraftsSection = ({ profile, setProfile }) => {
  const CRAFTS = ['Embroidery', 'Block Printing', 'Mirror Work', 'Ikat', 'Chikankari', 'Weaving', 'Pottery', 'Paintings', 'Woodwork', 'Metalwork', 'Jewellery', 'Ombre'];
  const CATS   = ['Clothing', 'Handicrafts', 'Accessories', 'Endangered Crafts'];

  const prefs = profile.craftPrefs    || [];
  const cats  = profile.categoryPrefs || [];

  const toggleCraft = val => {
    const next = prefs.includes(val) ? prefs.filter(v => v !== val) : [...prefs, val];
    const updated = { ...profile, craftPrefs: next };
    localStorage.setItem('ks_profile', JSON.stringify(updated));
    setProfile(updated);
  };

  const toggleCat = val => {
    const next = cats.includes(val) ? cats.filter(v => v !== val) : [...cats, val];
    const updated = { ...profile, categoryPrefs: next };
    localStorage.setItem('ks_profile', JSON.stringify(updated));
    setProfile(updated);
  };

  return (
    <Panel>
      <PanelTitle title="Craft Preferences"
        sub="Tell us what you love — we'll tailor your KalaSetu experience." />

      <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: T.goldDark }}>
        Craft Techniques
      </p>
      <div className="flex flex-wrap gap-2 mb-8">
        {CRAFTS.map(c => (
          <CraftChip key={c} label={c} selected={prefs.includes(c)} onToggle={() => toggleCraft(c)} />
        ))}
      </div>

      <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: T.goldDark }}>
        Product Categories
      </p>
      <div className="flex flex-wrap gap-2 mb-6">
        {CATS.map(c => (
          <CraftChip key={c} label={c} selected={cats.includes(c)} onToggle={() => toggleCat(c)} />
        ))}
      </div>

      {(prefs.length > 0 || cats.length > 0) && (
        <div className="rounded-xl px-4 py-3 text-sm" style={{ background: T.inputBg, color: T.sub }}>
          ✓ Preferences saved automatically as you select.
        </div>
      )}
    </Panel>
  );
};


/* ════════════════════════════════════════════════════
   SECTION: NEWSLETTER SETTINGS
════════════════════════════════════════════════════ */
const NewsletterSection = ({ profile, setProfile }) => {
  const prefs = profile.newsletterPrefs || {
    newArrivals: true, craftStories: true, offers: false, events: false,
  };

  const toggle = key => {
    const next = { ...prefs, [key]: !prefs[key] };
    const updated = { ...profile, newsletterPrefs: next };
    localStorage.setItem('ks_profile', JSON.stringify(updated));
    setProfile(updated);
  };

  const ITEMS = [
    { key: 'newArrivals',  label: 'New Arrivals',             sub: 'Be first to know when new artisan products launch.' },
    { key: 'craftStories', label: 'Artisan & Craft Stories',  sub: 'Stories from weavers, potters, and painters across India.' },
    { key: 'offers',       label: 'Exclusive Offers',         sub: 'Discount codes, seasonal sales, and member-only deals.' },
    { key: 'events',       label: 'Events & Exhibitions',     sub: 'Virtual craft fairs and artisan meet-and-greets.' },
  ];

  return (
    <Panel>
      <PanelTitle title="Newsletter Settings" sub="Choose what you'd like to hear from us." />
      <div className="flex flex-col gap-4">
        {ITEMS.map(item => (
          <label key={item.key}
            className="flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-150"
            style={{ background: prefs[item.key] ? T.inputBg : 'white', border: `1px solid ${T.border}` }}>
            <div>
              <p className="text-sm font-semibold" style={{ color: T.text }}>{item.label}</p>
              <p className="text-xs mt-0.5" style={{ color: T.sub }}>{item.sub}</p>
            </div>
            <div className="relative flex-shrink-0 ml-4">
              <input type="checkbox" className="sr-only" checked={prefs[item.key]} onChange={() => toggle(item.key)} />
              <div className="w-10 h-6 rounded-full transition-colors"
                style={{ background: prefs[item.key] ? T.goldDark : '#d1d5db' }}>
                <div className="w-5 h-5 rounded-full bg-white shadow transition-transform absolute top-0.5"
                  style={{ left: prefs[item.key] ? '1.25rem' : '0.125rem' }} />
              </div>
            </div>
          </label>
        ))}
      </div>
    </Panel>
  );
};


/* ════════════════════════════════════════════════════
   ROOT: PROFILE PAGE
════════════════════════════════════════════════════ */
const Profile = () => {
  const navigate = useNavigate();
  const { token, setToken, backendUrl, currency = '₹' } = useContext(ShopContext);

  const [active, setActive] = useState('overview');

  /* Load profile from localStorage (until backend /api/user/profile exists) */
  const [profile, setProfileState] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ks_profile')) || {}; }
    catch { return {}; }
  });

  const setProfile = data => { setProfileState(data); localStorage.setItem('ks_profile', JSON.stringify(data)); };

  const [orders, setOrders] = useState([]);

  /* Fetch orders once for the overview stats */
  useEffect(() => {
    if (!token) return;
    axios.post(backendUrl + '/api/order/userorders', {}, { headers: { token } })
      .then(res => { if (res.data.success) setOrders(res.data.orders); })
      .catch(() => {});
  }, [token]);

  /* Redirect if not logged in */
  useEffect(() => {
    if (!token) navigate('/login');
  }, [token]);

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
    navigate('/');
    toast.success('Logged out successfully.');
  };

  const renderSection = () => {
    switch (active) {
      case 'overview':   return <OverviewSection profile={profile} orders={orders} setActive={setActive} />;
      case 'profile':    return <ProfileSection profile={profile} setProfile={setProfile} backendUrl={backendUrl} token={token} />;
      case 'orders':     return <OrdersSection backendUrl={backendUrl} token={token} currency={currency} />;
      case 'addresses':  return <AddressSection profile={profile} setProfile={setProfile} />;
      case 'crafts':     return <CraftsSection profile={profile} setProfile={setProfile} />;
      case 'newsletter': return <NewsletterSection profile={profile} setProfile={setProfile} />;
      default:           return null;
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-8" style={{ background: T.pageBg }}>
      <div className="max-w-5xl mx-auto">

        {/* Page title */}
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: T.muted }}>
            Account
          </p>
          <h1 className="text-2xl font-bold" style={{ color: T.text }}>
            {profile.firstName ? profile.firstName : 'My Account'}
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-start">

          {/* ── SIDEBAR ── */}
          <aside className="w-full md:w-64 flex-shrink-0 rounded-2xl overflow-hidden"
            style={{ background: 'white', border: `1px solid ${T.border}` }}>

            {NAV.map((group, gi) => (
              <div key={gi} style={{ borderBottom: gi < NAV.length - 1 ? `1px solid ${T.border}20` : 'none' }}>
                {group.group && (
                  <p className="px-5 pt-4 pb-1 text-[10px] font-bold uppercase tracking-widest"
                    style={{ color: T.muted }}>
                    {group.group}
                  </p>
                )}
                {group.items.map(item => {
                  if (item.id === 'logout') {
                    return (
                      <button key="logout" onClick={handleLogout}
                        className="w-full text-left px-5 py-3 text-sm font-medium transition-colors hover:bg-red-50"
                        style={{ color: '#991b1b' }}>
                        Logout
                      </button>
                    );
                  }
                  const isActive = active === item.id;
                  return (
                    <button key={item.id} onClick={() => setActive(item.id)}
                      className="w-full text-left px-5 py-3 text-sm font-medium transition-all duration-150 border-l-2"
                      style={{
                        background:  isActive ? T.inputBg : 'transparent',
                        color:       isActive ? T.text : T.sub,
                        borderColor: isActive ? T.goldDark : 'transparent',
                        fontWeight:  isActive ? 700 : 500,
                      }}>
                      {item.label}
                    </button>
                  );
                })}
              </div>
            ))}
          </aside>

          {/* ── MAIN CONTENT ── */}
          <div className="flex-1 min-w-0">
            {renderSection()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
