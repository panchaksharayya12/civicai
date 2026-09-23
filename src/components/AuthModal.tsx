import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Lock, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  Eye,
  EyeOff,
  Building,
  CheckCircle2,
  LogIn,
  ShieldAlert,
  Key,
  BadgeCheck,
  Building2,
  Sliders,
  ChevronRight
} from 'lucide-react';
import { useCivic } from '../context/CivicContext';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authInitialPortal,
    login, 
    signup, 
    playUiSound 
  } = useCivic();

  // Primary Portal: Citizen vs Admin
  const [portal, setPortal] = useState<'citizen' | 'admin'>('citizen');

  // Sub-mode for Citizen: Signup vs Login
  const [citizenMode, setCitizenMode] = useState<'signup' | 'login'>('signup');
  const [showPassword, setShowPassword] = useState(false);

  // Citizen Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [ward, setWard] = useState('Ward 192 - Begur / Electronic City');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Admin Form Fields
  const [adminEmail, setAdminEmail] = useState('commissioner@bbmp.gov.in');
  const [adminDept, setAdminDept] = useState('Central City Command & Disaster Cell');
  const [adminPassword, setAdminPassword] = useState('admin123');

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authInitialPortal) {
      setPortal(authInitialPortal);
    }
  }, [authInitialPortal, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    setIsAuthModalOpen(false);
    setError(null);
    playUiSound('beep');
  };

  const handleQuickAdminLogin = (profile: 'commissioner' | 'engineer') => {
    playUiSound('success');
    if (profile === 'commissioner') {
      login('commissioner@bbmp.gov.in', 'admin123', 'admin');
    } else {
      login('engineer.ward192@bbmp.gov.in', 'officer123', 'officer');
    }
  };

  const handleQuickCitizenLogin = () => {
    playUiSound('success');
    login('priya@citizen.in', 'civic123', 'citizen');
  };

  const handleSubmitCitizen = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (citizenMode === 'signup') {
      if (!name.trim()) {
        setError('Please enter your full legal name');
        playUiSound('alert');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setError('Please enter a valid email address');
        playUiSound('alert');
        return;
      }
      if (!password || password.length < 6) {
        setError('Password must be at least 6 characters');
        playUiSound('alert');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        playUiSound('alert');
        return;
      }

      signup({
        name,
        email,
        phone: phone || '+91 98450 12345',
        ward,
        role: 'citizen',
        password,
      });
    } else {
      if (!email.trim()) {
        setError('Please enter your registered email');
        playUiSound('alert');
        return;
      }
      if (!password) {
        setError('Please enter your password');
        playUiSound('alert');
        return;
      }
      login(email, password, 'citizen');
    }
  };

  const handleSubmitAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!adminEmail.trim()) {
      setError('Please provide municipal officer ID or government email');
      playUiSound('alert');
      return;
    }
    if (!adminPassword) {
      setError('Please enter the security access token');
      playUiSound('alert');
      return;
    }

    login(adminEmail, adminPassword, 'admin');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Portal Switcher (Citizen vs Admin) */}
        <div className="grid grid-cols-2 p-2 bg-slate-100 border-b border-slate-200">
          <button
            type="button"
            onClick={() => { setPortal('citizen'); setError(null); playUiSound('beep'); }}
            className={`py-3 px-3 rounded-2xl text-xs font-bold font-mono transition flex items-center justify-center gap-2 ${
              portal === 'citizen'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80 ring-2 ring-sky-500/20'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <User className="w-4 h-4 text-sky-600" />
            <span>Citizen Portal</span>
          </button>

          <button
            type="button"
            onClick={() => { setPortal('admin'); setError(null); playUiSound('beep'); }}
            className={`py-3 px-3 rounded-2xl text-xs font-bold font-mono transition flex items-center justify-center gap-2 ${
              portal === 'admin'
                ? 'bg-slate-900 text-white shadow-md border border-slate-800 ring-2 ring-emerald-500/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Official Admin Portal</span>
          </button>
        </div>

        {/* Header Ribbon Based on Selected Portal */}
        {portal === 'admin' ? (
          <div className="bg-slate-900 text-white px-6 py-4 relative overflow-hidden border-b border-slate-800">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-sm">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base tracking-tight font-display text-white">
                      BBMP Command & Control
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold uppercase">
                      Gov Secure
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-mono">
                    Official Municipal Authority Grievance Triage Gateway
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900 text-white px-6 py-4 relative overflow-hidden border-b border-slate-800">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-sky-500/20 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400 shadow-sm">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base tracking-tight font-display text-white">
                      Citizen Grievance Access
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 font-bold uppercase">
                      Resident
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-mono">
                    Verify credentials to submit and track civic complaints
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Citizen Sub-Mode Selector (Signup vs Login) */}
        {portal === 'citizen' && (
          <div className="flex border-b border-slate-200 bg-slate-50 p-1.5">
            <button
              type="button"
              onClick={() => { setCitizenMode('signup'); setError(null); playUiSound('beep'); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                citizenMode === 'signup'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80 font-mono'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <User className="w-3.5 h-3.5 text-sky-600" />
              Create Account
            </button>
            <button
              type="button"
              onClick={() => { setCitizenMode('login'); setError(null); playUiSound('beep'); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                citizenMode === 'login'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80 font-mono'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LogIn className="w-3.5 h-3.5 text-sky-600" />
              Sign In
            </button>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-in fade-in">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>{error}</span>
          </div>
        )}

        {/* PORTAL BODY */}
        <div className="p-6 max-h-[65vh] overflow-y-auto">
          {portal === 'admin' ? (
            /* ================= ADMIN ACCESS FORM ================= */
            <form onSubmit={handleSubmitAdmin} className="space-y-4">
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-[11px] text-emerald-900 font-mono flex items-start gap-2.5">
                <BadgeCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Authorized Municipal Personnel Only</strong>
                  Provides live access to review and resolve citizen complaints, dispatch repair crews, and control AI priority weights.
                </div>
              </div>

              {/* Department Dropdown */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                  Municipal Department
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <select
                    value={adminDept}
                    onChange={(e) => setAdminDept(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-xs sm:text-sm text-slate-900 font-medium transition"
                  >
                    <option value="Central City Command & Disaster Cell">Central City Command & Disaster Cell</option>
                    <option value="Municipal Roads & Infrastructure">Municipal Roads & Infrastructure (BBMP)</option>
                    <option value="Water Supply & Sewerage Wing">Water Supply & Sewerage Board (BWSSB)</option>
                    <option value="Electricity & Street Lighting">Electricity Supply Company (BESCOM)</option>
                    <option value="Solid Waste & Public Health">Solid Waste & Public Sanitation Cell</option>
                  </select>
                </div>
              </div>

              {/* Official Email / Officer ID */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                  Official Gov Email / Officer ID
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="officer.roads@bbmp.gov.in"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-xs sm:text-sm text-slate-900 font-mono transition"
                  />
                </div>
              </div>

              {/* Admin Security Token / Password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                  Administrative Access Token / Password
                </label>
                <div className="relative">
                  <Key className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-xs sm:text-sm text-slate-900 font-mono transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Admin Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 group font-mono mt-2"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Access Municipal Operations App</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition text-emerald-400" />
              </button>
            </form>
          ) : (
            /* ================= CITIZEN PORTAL FORM ================= */
            <form onSubmit={handleSubmitCitizen} className="space-y-3.5">
              {citizenMode === 'signup' ? (
                <>
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1 font-mono">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Priya Sharma"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-sm text-slate-900 font-medium transition"
                      />
                    </div>
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1 font-mono">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="priya@citizen.in"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-sm text-slate-900 font-medium transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1 font-mono">
                        Mobile Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98450 12345"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-sm text-slate-900 font-medium transition"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Ward / Area */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1 font-mono">
                      Municipal Ward / Area
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                      <select
                        value={ward}
                        onChange={(e) => setWard(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-sm text-slate-900 font-medium transition appearance-none"
                      >
                        <option value="Ward 192 - Begur / Electronic City">Ward 192 - Begur / Electronic City</option>
                        <option value="Ward 85 - Doddanekkundi / Whitefield">Ward 85 - Doddanekkundi / Whitefield</option>
                        <option value="Ward 151 - Koramangala">Ward 151 - Koramangala Central</option>
                        <option value="Ward 174 - HSR Layout Sector 1-7">Ward 174 - HSR Layout Sector 1-7</option>
                        <option value="Ward 110 - Indiranagar / HAL">Ward 110 - Indiranagar</option>
                      </select>
                    </div>
                  </div>

                  {/* Password & Confirm */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1 font-mono">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-sm text-slate-900 font-medium transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1 font-mono">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-sm text-slate-900 font-medium transition"
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Sign In Fields */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1 font-mono">
                      Email or Mobile
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="priya@citizen.in"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-sm text-slate-900 font-medium transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1 font-mono">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-sm text-slate-900 font-medium transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 group font-mono mt-2"
              >
                <span>{citizenMode === 'signup' ? 'Create Citizen Account & Verify' : 'Sign In as Resident'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition text-sky-400" />
              </button>
            </form>
          )}
        </div>

        {/* ⚡ 1-Click Fast Instant Logins */}
        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-slate-600 uppercase tracking-wider font-bold">
              ⚡ Instant 1-Click Demo Profiles:
            </span>
            <span className="text-[10px] text-slate-400 font-mono">No typing required</span>
          </div>

          {portal === 'admin' ? (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickAdminLogin('commissioner')}
                className="px-3 py-2.5 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-left transition group shadow-2xs"
              >
                <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Rajesh Kumar</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">BBMP Commissioner (Admin)</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickAdminLogin('engineer')}
                className="px-3 py-2.5 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-left transition group shadow-2xs"
              >
                <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-800 flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-emerald-600" />
                  <span>Suresh Patil</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">Ward 192 Chief Engineer</div>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleQuickCitizenLogin}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-300 text-left transition group shadow-2xs flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-600" />
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-sky-800">
                    Priya Sharma (Resident Citizen)
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">Ward 192 - Begur / Electronic City</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-0.5 transition" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
