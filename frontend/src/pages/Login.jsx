import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';

/*
  ┌─────────────────────────────────────────────────────────┐
  │  Add to your frontend/.env file:                        │
  │  VITE_BACKEND_URL=http://localhost:4000                 │
  └─────────────────────────────────────────────────────────┘
  ShopContext must expose: { setToken }
*/
const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

/* ════════════════════════════════════════════
   DESIGN TOKENS
════════════════════════════════════════════ */
const C = {
  pageBg:   '#fdf8ed',
  inputBg:  '#e8d5a3',
  btnBg:    '#d4b483',
  btnHover: '#c4a270',
  border:   '#c9a96e',
  text:     '#2c1a0e',
  subtext:  '#7a5c3a',
  accent:   '#8b0000',
  link:     '#5b4a00',
};

/* ════════════════════════════════════════════
   TOAST BAR — fixed top-right, auto-dismiss 3.5s
════════════════════════════════════════════ */
const ToastBar = ({ toasts }) => (
  <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
    {toasts.map(t => (
      <div
        key={t.id}
        className="px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white max-w-xs"
        style={{ background: t.type === 'error' ? '#991b1b' : '#166534' }}
      >
        {t.type === 'error' ? '✕  ' : '✓  '}{t.msg}
      </div>
    ))}
  </div>
);

/* ════════════════════════════════════════════
   HELPERS
════════════════════════════════════════════ */
const getStrength = (p) => {
  if (!p) return null;
  let s = 0;
  if (p.length >= 8)           s++;
  if (/[A-Z]/.test(p))         s++;
  if (/[0-9]/.test(p))         s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return [
    null,
    { label: 'Weak',   color: '#dc2626', w: '25%'  },
    { label: 'Fair',   color: '#d97706', w: '50%'  },
    { label: 'Good',   color: '#16a34a', w: '75%'  },
    { label: 'Strong', color: '#15803d', w: '100%' },
  ][s] ?? { label: 'Weak', color: '#dc2626', w: '25%' };
};

/* ════════════════════════════════════════════
   UI ATOMS
════════════════════════════════════════════ */
const Field = ({ placeholder, type = 'text', value, onChange, required, autoFocus }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    required={required}
    autoFocus={autoFocus}
    className="w-full rounded-md px-4 py-3 text-sm outline-none placeholder:text-[#9a7d50]
               transition-shadow focus:ring-2 focus:ring-[#c4a270]"
    style={{ background: C.inputBg, border: `1px solid ${C.border}`, color: C.text }}
  />
);

const PasswordField = ({ placeholder = 'Password', value, onChange, required, autoFocus, showStrength }) => {
  const [show, setShow] = useState(false);
  const strength = showStrength ? getStrength(value) : null;
  return (
    <div>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          autoFocus={autoFocus}
          className="w-full rounded-md px-4 py-3 pr-16 text-sm outline-none placeholder:text-[#9a7d50]
                     transition-shadow focus:ring-2 focus:ring-[#c4a270]"
          style={{ background: C.inputBg, border: `1px solid ${C.border}`, color: C.text }}
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold hover:opacity-70"
          style={{ color: C.subtext }}
        >
          {show ? 'Hide' : 'Show'}
        </button>
      </div>
      {strength && (
        <div className="mt-1.5">
          <div className="h-1 rounded-full bg-gray-200 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-300"
              style={{ width: strength.w, background: strength.color }} />
          </div>
          <p className="text-[10px] mt-0.5" style={{ color: strength.color }}>{strength.label} password</p>
        </div>
      )}
    </div>
  );
};

const GoldBtn = ({ children, onClick, type = 'button', secondary = false, disabled = false }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className="w-full rounded-md py-3 text-sm font-medium tracking-wide
               transition-all duration-200 active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed"
    style={{ background: secondary ? 'transparent' : C.btnBg, border: `1px solid ${C.border}`, color: C.text }}
    onMouseEnter={e => { if (!secondary && !disabled) e.currentTarget.style.background = C.btnHover; }}
    onMouseLeave={e => { if (!secondary && !disabled) e.currentTarget.style.background = C.btnBg; }}
  >
    {children}
  </button>
);

const OrDivider = () => (
  <div className="flex items-center gap-3 my-1">
    <div className="flex-1 border-t" style={{ borderColor: C.border }} />
    <span className="text-xs font-semibold tracking-widest" style={{ color: C.subtext }}>OR</span>
    <div className="flex-1 border-t" style={{ borderColor: C.border }} />
  </div>
);

const SocialBtn = ({ icon, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full rounded-md py-3 text-sm font-medium flex items-center justify-center gap-2.5
               transition-all duration-200 active:scale-[.98]"
    style={{ background: C.inputBg, border: `1px solid ${C.border}`, color: C.text }}
    onMouseEnter={e => e.currentTarget.style.background = C.btnHover}
    onMouseLeave={e => e.currentTarget.style.background = C.inputBg}
  >
    {icon}{label}
  </button>
);

const Select = ({ placeholder, options, value, onChange, required }) => (
  <select
    value={value}
    onChange={onChange}
    required={required}
    className="w-full rounded-md px-4 py-3 text-sm outline-none transition-shadow
               focus:ring-2 focus:ring-[#c4a270] appearance-none"
    style={{ background: C.inputBg, border: `1px solid ${C.border}`, color: value ? C.text : '#9a7d50' }}
  >
    <option value="" disabled>{placeholder}</option>
    {options.map(o => <option key={o} value={o}>{o}</option>)}
  </select>
);

/* ════════════════════════════════════════════
   6-BOX OTP INPUT
   Auto-advances on digit, backspace goes back,
   supports paste of a full 6-digit string
════════════════════════════════════════════ */
const OtpInput = ({ otp, setOtp }) => {
  const refs = useRef([]);

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const next = Array.from({ length: 6 }, (_, i) => pasted[i] || '');
    setOtp(next);
    refs.current[Math.min(pasted.length, 5)]?.focus();
    e.preventDefault();
  };

  return (
    <div className="flex gap-2 justify-center">
      {otp.map((digit, i) => (
        <input
          key={i}
          ref={el => refs.current[i] = el}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className="w-11 h-12 text-center text-lg font-bold rounded-md outline-none
                     focus:ring-2 focus:ring-[#c4a270] transition-shadow"
          style={{
            background: C.inputBg,
            border: `1.5px solid ${digit ? C.btnHover : C.border}`,
            color: C.text,
          }}
        />
      ))}
    </div>
  );
};

/* ════════════════════════════════════════════
   ICONS
════════════════════════════════════════════ */
const GoogleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);
const PhoneIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 8V5z"/>
  </svg>
);

/* ════════════════════════════════════════════
   ROLE SELECTOR
════════════════════════════════════════════ */
const RoleSelector = ({ onSelect }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center px-6 py-10 max-w-sm mx-auto">
      <p className="italic text-sm mb-8" style={{ fontFamily: 'Georgia, serif', color: C.subtext }}>
        Every Purchase Preserves a Tradition.
      </p>
      <h1 className="text-2xl font-bold text-center mb-1" style={{ color: C.text }}>Welcome to KalaSetu</h1>
      <p className="text-sm text-center mb-8" style={{ color: C.subtext }}>How would you like to continue?</p>

      <div className="w-full flex flex-col gap-3">
        {[
          { id: 'buyer',  emoji: '🛍️', title: 'Shop as a Buyer',   sub: 'Discover authentic handcrafted treasures' },
          { id: 'seller', emoji: '🎨', title: 'Sell as an Artisan', sub: 'Showcase your craft to the world' },
        ].map(r => (
          <button
            key={r.id}
            onClick={() => onSelect(r.id)}
            className="w-full rounded-xl px-5 py-4 flex items-center gap-4 text-left
                       transition-all duration-200 active:scale-[.98] hover:shadow-md"
            style={{ background: C.inputBg, border: `1px solid ${C.border}` }}
            onMouseEnter={e => e.currentTarget.style.background = C.btnHover}
            onMouseLeave={e => e.currentTarget.style.background = C.inputBg}
          >
            <span className="text-2xl">{r.emoji}</span>
            <div className="flex-1">
              <p className="font-semibold text-sm" style={{ color: C.text }}>{r.title}</p>
              <p className="text-xs mt-0.5" style={{ color: C.subtext }}>{r.sub}</p>
            </div>
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: C.subtext }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>

      <div className="mt-8 rounded-xl px-4 py-3 text-center text-xs leading-relaxed"
        style={{ background: '#f5ead0', border: `1px solid ${C.border}`, color: C.subtext }}>
        💡 Already registered? A single account lets you <strong>both shop and sell</strong> on KalaSetu — switch roles anytime from your dashboard.
      </div>
      <button onClick={() => navigate('/')} className="mt-6 text-xs underline hover:opacity-70 transition-opacity" style={{ color: C.subtext }}>
        Back to Home
      </button>
    </div>
  );
};

/* ════════════════════════════════════════════
   BUYER AUTH — smart email-first flow

   Step machine:
     'email'       →  user enters email
     'signin'      →  email EXISTS  → enter password
     'otp'         →  email NEW     → verify 6-digit code
     'newpassword' →  OTP verified  → create password → register
════════════════════════════════════════════ */
const BuyerAuth = ({ onBack, toast }) => {
  const navigate     = useNavigate();
  const { setToken } = useContext(ShopContext);

  const [step,        setStep]        = useState('email');
  const [email,       setEmail]       = useState('');
  const [password,    setPassword]    = useState('');
  const [newPass,     setNewPass]     = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [otp,         setOtp]         = useState(Array(6).fill(''));
  const [loading,     setLoading]     = useState(false);
  const [newsletter,  setNewsletter]  = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  /* 60-second resend countdown while on OTP step */
  useEffect(() => {
    if (step !== 'otp' || resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer(r => r - 1), 1000);
    return () => clearTimeout(t);
  }, [step, resendTimer]);

  /* STEP 1: check email */
  const handleEmailContinue = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: POST /api/user/check-email  →  { exists: boolean }
      const { data } = await axios.post(`${BACKEND}/api/user/check-email`, { email });
      if (data.exists) {
        setStep('signin');
      } else {
        // TODO: POST /api/user/send-otp  →  { success: boolean }
        await axios.post(`${BACKEND}/api/user/send-otp`, { email });
        setResendTimer(60);
        setStep('otp');
        toast(`Verification code sent to ${email}`);
      }
    } catch {
      toast('Something went wrong. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  /* STEP 2a: sign in (email existed) */
  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: POST /api/user/login  →  { success, token, message }
      const { data } = await axios.post(`${BACKEND}/api/user/login`, { email, password });
      if (data.success) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        toast('Welcome back! Login successful.');
        setTimeout(() => navigate('/'), 1200);
      } else {
        toast(data.message || 'Incorrect password. Please try again.', 'error');
      }
    } catch {
      toast('Login failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  /* STEP 2b: verify OTP (email is new) */
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) { toast('Please enter the complete 6-digit code.', 'error'); return; }
    setLoading(true);
    try {
      // TODO: POST /api/user/verify-otp  →  { valid: boolean }
      const { data } = await axios.post(`${BACKEND}/api/user/verify-otp`, { email, otp: code });
      if (data.valid) {
        setStep('newpassword');
      } else {
        toast('Incorrect code. Please try again.', 'error');
      }
    } catch {
      toast('Verification failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  /* Resend OTP */
  const handleResend = async () => {
    if (resendTimer > 0) return;
    try {
      await axios.post(`${BACKEND}/api/user/send-otp`, { email });
      setOtp(Array(6).fill(''));
      setResendTimer(60);
      toast('New code sent!');
    } catch {
      toast('Could not resend. Please try again.', 'error');
    }
  };

  /* STEP 3: create password → register */
  const handleCreateAccount = async (e) => {
    e.preventDefault();
    if (newPass !== confirmPass) { toast('Passwords do not match.', 'error'); return; }
    if (newPass.length < 8)      { toast('Password must be at least 8 characters.', 'error'); return; }
    setLoading(true);
    try {
      // TODO: POST /api/user/register  →  { success, token, message }
      // Backend should confirm that OTP was verified for this email before creating account
      const { data } = await axios.post(`${BACKEND}/api/user/register`, {
        email, password: newPass, newsletter,
      });
      if (data.success) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        toast('Account created! Welcome to KalaSetu 🎉');
        setTimeout(() => navigate('/'), 1400);
      } else {
        toast(data.message || 'Registration failed.', 'error');
      }
    } catch {
      toast('Could not create account. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  /* Shared section header */
  const Header = ({ title, sub }) => (
    <>
      <h1 className="text-2xl font-bold text-center leading-snug mb-1" style={{ color: C.text }}>{title}</h1>
      {sub && <p className="text-sm text-center mb-6" style={{ color: C.subtext }}>{sub}</p>}
    </>
  );

  /* ── email entry ── */
  if (step === 'email') return (
    <div className="flex flex-col px-6 py-8 max-w-sm mx-auto">
      <Header title={<>Sign Up as a Buyer &<br />Shop Authentic Handcrafted Treasures</>} />
      <p className="text-xs text-center mb-1" style={{ color: C.subtext }}>
        By continuing, you agree to our <button className="underline font-medium" style={{ color: C.link }}>privacy policy</button>
      </p>
      <p className="italic text-sm text-center mb-7" style={{ fontFamily: 'Georgia, serif', color: C.subtext }}>
        Every Purchase Preserves a Tradition.
      </p>
      <div className="flex flex-col gap-3">
        <SocialBtn icon={<GoogleIcon />} label="Continue with Google" onClick={() => alert('Wire up your Google OAuth provider')} />
        <SocialBtn icon={<PhoneIcon />}  label="Continue with Phone"  onClick={() => alert('Wire up your phone OTP provider')} />
      </div>
      <OrDivider />
      <form onSubmit={handleEmailContinue} className="flex flex-col gap-3">
        <Field placeholder="Enter your Email address" type="email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
        <GoldBtn type="submit" disabled={loading}>{loading ? 'Checking…' : 'Continue with Email'}</GoldBtn>
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input type="checkbox" checked={newsletter} onChange={e => setNewsletter(e.target.checked)} className="mt-0.5 w-4 h-4 accent-[#c4a270] flex-shrink-0" />
          <span className="text-xs leading-relaxed" style={{ color: C.subtext }}>Keep me updated with new collections and artisan stories.</span>
        </label>
        <GoldBtn secondary onClick={() => navigate('/')}>Back to Home</GoldBtn>
      </form>
      <p className="text-xs text-center mt-5" style={{ color: C.subtext }}>
        Want to sell? <button onClick={() => onBack('seller')} className="underline font-medium" style={{ color: C.link }}>Join as an Artisan</button>
      </p>
      <button onClick={onBack} className="mt-3 text-xs text-center underline hover:opacity-70 transition-opacity" style={{ color: C.subtext }}>← Change role</button>
    </div>
  );

  /* ── password (returning user) ── */
  if (step === 'signin') return (
    <div className="flex flex-col px-6 py-8 max-w-sm mx-auto">
      <Header title="Welcome back!" sub={`Signing in as ${email}`} />
      <form onSubmit={handleSignIn} className="flex flex-col gap-3">
        <PasswordField placeholder="Your password" value={password} onChange={e => setPassword(e.target.value)} required autoFocus />
        <GoldBtn type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign In'}</GoldBtn>
        <div className="flex justify-between">
          <button type="button" onClick={() => setStep('email')} className="text-xs underline" style={{ color: C.subtext }}>← Change email</button>
          <button type="button" className="text-xs underline" style={{ color: C.link }}>Forgot password?</button>
        </div>
      </form>
    </div>
  );

  /* ── OTP (new user) ── */
  if (step === 'otp') return (
    <div className="flex flex-col px-6 py-8 max-w-sm mx-auto items-center text-center">
      <div className="text-4xl mb-4">📬</div>
      <Header title="Check your inbox" sub={`We sent a 6-digit code to ${email}`} />
      <form onSubmit={handleVerifyOtp} className="flex flex-col gap-5 w-full items-center">
        <OtpInput otp={otp} setOtp={setOtp} />
        <GoldBtn type="submit" disabled={loading}>{loading ? 'Verifying…' : 'Verify Code'}</GoldBtn>
      </form>
      <div className="mt-4 flex items-center gap-1.5 text-xs" style={{ color: C.subtext }}>
        <span>Didn't receive it?</span>
        {resendTimer > 0
          ? <span>Resend in <strong style={{ color: C.text }}>{resendTimer}s</strong></span>
          : <button onClick={handleResend} className="underline font-medium" style={{ color: C.link }}>Resend code</button>
        }
      </div>
      <button onClick={() => setStep('email')} className="mt-3 text-xs underline hover:opacity-70" style={{ color: C.subtext }}>← Change email</button>
    </div>
  );

  /* ── create password (OTP passed) ── */
  if (step === 'newpassword') return (
    <div className="flex flex-col px-6 py-8 max-w-sm mx-auto">
      <div className="text-4xl text-center mb-4">🔑</div>
      <Header title="Create your password" sub="Choose a strong password to secure your new account." />
      <form onSubmit={handleCreateAccount} className="flex flex-col gap-3">
        <PasswordField placeholder="New password (min. 8 characters)" value={newPass} onChange={e => setNewPass(e.target.value)} required autoFocus showStrength />
        <PasswordField placeholder="Confirm password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} required />
        <GoldBtn type="submit" disabled={loading}>{loading ? 'Creating account…' : 'Create Account & Continue'}</GoldBtn>
      </form>
    </div>
  );

  return null;
};

/* ════════════════════════════════════════════
   SELLER AUTH — explicit Login / Sign Up tabs
════════════════════════════════════════════ */
const SellerAuth = ({ onBack, toast }) => {
  const navigate     = useNavigate();
  const { setToken } = useContext(ShopContext);
  const [tab, setTab] = useState('login');

  const [loginEmail,    setLoginEmail]    = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading,  setLoginLoading]  = useState(false);

  const [form, setForm] = useState({
    fullName: '', businessName: '', phone: '', email: '',
    state: '', pincode: '', madeHow: '', bizReg: '',
    productCategory: '', hearAbout: '',
    password: '', confirmPassword: '',
  });
  const [signupLoading, setSignupLoading] = useState(false);
  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      // TODO: POST /api/seller/login  →  { success, token, message }
      const { data } = await axios.post(`${BACKEND}/api/seller/login`, {
        email: loginEmail, password: loginPassword,
      });
      if (data.success) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        toast('Welcome back, Artisan! 🎨');
        setTimeout(() => navigate('/seller/dashboard'), 1200);
      } else {
        toast(data.message || 'Login failed.', 'error');
      }
    } catch {
      toast('Login failed. Please try again.', 'error');
    } finally {
      setLoginLoading(false);
    }
  };

  /* Fixed: was missing async keyword in previous version */
  const handleSignup = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast('Passwords do not match.', 'error'); return; }
    if (form.password.length < 8)               { toast('Password must be at least 8 characters.', 'error'); return; }
    setSignupLoading(true);
    try {
      // TODO: POST /api/seller/register  →  { success, token, message }
      const { data } = await axios.post(`${BACKEND}/api/seller/register`, {
        name: form.fullName, businessName: form.businessName,
        phone: form.phone,   email: form.email,
        state: form.state,   pincode: form.pincode,
        madeHow: form.madeHow, bizReg: form.bizReg,
        productCategory: form.productCategory,
        hearAbout: form.hearAbout,
        password: form.password,
      });
      if (data.success) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        toast('Welcome to KalaSetu! Your artisan profile is under review 🎉');
        setTimeout(() => navigate('/seller/dashboard'), 1400);
      } else {
        toast(data.message || 'Registration failed.', 'error');
      }
    } catch {
      toast('Could not create account. Please try again.', 'error');
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className="flex flex-col px-6 py-8 max-w-lg mx-auto w-full">
      <h1 className="text-2xl font-bold text-center mb-1" style={{ color: C.text }}>
        Showcase Your Craft. Reach More Buyers.
      </h1>
      <p className="text-xs text-center mb-1" style={{ color: C.subtext }}>
        By continuing, you agree to our <button className="underline font-medium" style={{ color: C.link }}>privacy policy</button>
      </p>
      <p className="italic text-sm text-center mb-6" style={{ fontFamily: 'Georgia, serif', color: C.subtext }}>
        Your Craft Deserves the World.
      </p>

      <div className="flex rounded-lg overflow-hidden mb-6" style={{ border: `1px solid ${C.border}` }}>
        {[['login', 'Log In'], ['signup', 'Sign Up']].map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)}
            className="flex-1 py-2.5 text-sm font-medium transition-colors duration-200"
            style={{ background: tab === t ? C.btnBg : 'transparent', color: C.text }}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'login' && (
        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <SocialBtn icon={<GoogleIcon />} label="Continue with Google" onClick={() => alert('Wire up Google OAuth')} />
          <SocialBtn icon={<PhoneIcon />}  label="Continue with Phone"  onClick={() => alert('Wire up phone OTP')} />
          <OrDivider />
          <Field placeholder="Email address" type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required />
          <PasswordField placeholder="Password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required />
          <GoldBtn type="submit" disabled={loginLoading}>{loginLoading ? 'Signing in…' : 'Sign In'}</GoldBtn>
          <div className="flex justify-between">
            <p className="text-xs" style={{ color: C.subtext }}>
              New artisan? <button type="button" onClick={() => setTab('signup')} className="underline font-medium" style={{ color: C.link }}>Create account</button>
            </p>
            <button type="button" className="text-xs underline" style={{ color: C.link }}>Forgot password?</button>
          </div>
        </form>
      )}

      {tab === 'signup' && (
        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            {[
              { label: 'Full Name',     key: 'fullName',     placeholder: 'Full Name',     req: true },
              { label: 'Business Name', key: 'businessName', placeholder: 'Business Name', req: true },
              { label: 'Phone Number',  key: 'phone',        placeholder: 'Phone number',  req: true, type: 'tel' },
              { label: 'Email ID',      key: 'email',        placeholder: 'Email ID',      req: true, type: 'email' },
              { label: 'State',         key: 'state',        placeholder: 'State',         req: true },
              { label: 'Pincode',       key: 'pincode',      placeholder: 'Pincode',       req: true, type: 'number' },
            ].map(({ label, key, placeholder, req, type }) => (
              <div key={key} className="flex flex-col gap-1">
                <label className="text-xs font-semibold" style={{ color: C.text }}>
                  {label}{req && <span style={{ color: C.accent }}> *</span>}
                </label>
                <Field placeholder={placeholder} type={type || 'text'} value={form[key]} onChange={set(key)} required={req} />
              </div>
            ))}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold" style={{ color: C.text }}>How are your products made?<span style={{ color: C.accent }}> *</span></label>
              <Select placeholder="Click to select" options={['Hand-made entirely','Partially machine-assisted','Collaborative workshop','Other']} value={form.madeHow} onChange={set('madeHow')} required />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold" style={{ color: C.text }}>Business Registration<span style={{ color: C.accent }}> *</span></label>
              <Select placeholder="Click to select" options={['Registered (GST/MSME)','Sole Proprietor','NGO / Self-Help Group','Unregistered — Individual Artisan']} value={form.bizReg} onChange={set('bizReg')} required />
            </div>
            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className="text-xs font-semibold" style={{ color: C.text }}>Product Category<span style={{ color: C.accent }}> *</span></label>
              <Field placeholder="e.g., Pottery, Textiles, Paintings" value={form.productCategory} onChange={set('productCategory')} required />
            </div>
            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className="text-xs font-semibold" style={{ color: C.text }}>How did you hear about KalaSetu?<span style={{ color: C.accent }}> *</span></label>
              <Select placeholder="Click to select" options={['Social Media','Friend / Word of Mouth','NGO / Government Scheme','News / Article','Other']} value={form.hearAbout} onChange={set('hearAbout')} required />
            </div>
            <div className="sm:col-span-2 border-t pt-4" style={{ borderColor: C.border }}>
              <p className="text-xs font-semibold mb-2" style={{ color: C.text }}>
                Create a password<span style={{ color: C.accent }}> *</span>
              </p>
              <PasswordField placeholder="New password (min. 8 characters)" value={form.password} onChange={set('password')} required showStrength />
            </div>
            <div className="sm:col-span-2">
              <PasswordField placeholder="Confirm password" value={form.confirmPassword} onChange={set('confirmPassword')} required />
            </div>
          </div>
          <GoldBtn type="submit" disabled={signupLoading}>{signupLoading ? 'Creating your profile…' : 'Join KalaSetu'}</GoldBtn>
          <p className="text-xs text-center" style={{ color: C.subtext }}>
            Already a seller? <button type="button" onClick={() => setTab('login')} className="underline font-medium" style={{ color: C.link }}>Log In</button>
          </p>
        </form>
      )}

      <button onClick={onBack} className="mt-5 text-xs text-center underline hover:opacity-70 transition-opacity" style={{ color: C.subtext }}>
        ← Change role
      </button>
    </div>
  );
};

/* ════════════════════════════════════════════
   ROOT — owns view state + toast queue
════════════════════════════════════════════ */
const Login = () => {
  const [view,   setView]   = useState('select');
  const [toasts, setToasts] = useState([]);

  const toast = (msg, type = 'success') => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  };

  return (
    <div className="min-h-screen py-10" style={{ background: C.pageBg }}>
      <ToastBar toasts={toasts} />
      {view === 'select' && <RoleSelector onSelect={r => setView(r)} />}
      {view === 'buyer'  && <BuyerAuth  onBack={r => setView(r || 'select')} toast={toast} />}
      {view === 'seller' && <SellerAuth onBack={r => setView(r || 'select')} toast={toast} />}
    </div>
  );
};

export default Login;
