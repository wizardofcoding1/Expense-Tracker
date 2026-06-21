import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Calendar, Clipboard, UserPlus, Eye, EyeOff } from 'lucide-react';
import bgImage from '../assets/Gemini_Generated_Image_lua8zilua8zilua8.png';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'male',
    email: '',
    password: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, dateOfBirth, gender, email, password } = formData;
    
    if (!firstName || !lastName || !dateOfBirth || !gender || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await register(formData);
      if (res.success) {
        navigate('/');
      } else {
        setError(res.message || 'Registration failed.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="w-full max-w-lg z-10 py-8 animate-page-transition">
        {/* App identity */}
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-3xl font-extrabold tracking-wider bg-gradient-to-r from-[#b39262] via-[#d6c29b] to-[#8c6c3f] bg-clip-text text-transparent m-0">
            FINTRACK
          </h2>
        </div>

        {/* Register form card */}
        <div className="gold-panel p-8 rounded-3xl">
          <h3 className="text-2xl font-bold mb-2" style={{ color: '#3d352b' }}>Create Account</h3>
          <p className="text-sm mb-6" style={{ color: '#8c6c3f' }}>Sign up to start tracking your finances</p>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#8c6c3f' }}>
                  First Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center" style={{ color: '#b39262' }}>
                    <User size={18} />
                  </span>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    className="gold-input w-full pl-11 pr-4 py-3 rounded-xl text-sm placeholder-stone-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#8c6c3f' }}>
                  Last Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center" style={{ color: '#b39262' }}>
                    <User size={18} />
                  </span>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    className="gold-input w-full pl-11 pr-4 py-3 rounded-xl text-sm placeholder-stone-400"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#8c6c3f' }}>
                  Date of Birth
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center" style={{ color: '#b39262' }}>
                    <Calendar size={18} />
                  </span>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="gold-input w-full pl-11 pr-4 py-3 rounded-xl text-sm placeholder-stone-400 [color-scheme:light]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#8c6c3f' }}>
                  Gender
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center" style={{ color: '#b39262' }}>
                    <Clipboard size={18} />
                  </span>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="gold-input w-full pl-11 pr-4 py-3 rounded-xl text-sm"
                    required
                  >
                    <option value="male" className="bg-[#fcfaf6] text-[#3d352b]">Male</option>
                    <option value="female" className="bg-[#fcfaf6] text-[#3d352b]">Female</option>
                    <option value="other" className="bg-[#fcfaf6] text-[#3d352b]">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#8c6c3f' }}>
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center" style={{ color: '#b39262' }}>
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john.doe@example.com"
                  className="gold-input w-full pl-11 pr-4 py-3 rounded-xl text-sm placeholder-stone-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#8c6c3f' }}>
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center" style={{ color: '#b39262' }}>
                  <Lock size={18} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="•••••••• (Min 6 chars)"
                  className="gold-input w-full pl-11 pr-12 py-3 rounded-xl text-sm placeholder-stone-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center hover:text-[#8c6c3f] transition-colors"
                  style={{ color: '#b39262' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="gold-button w-full mt-4 py-3 px-4 rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Registering Account...
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  Sign Up
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm mt-6" style={{ color: '#8c6c3f' }}>
          Already have an account?{' '}
          <Link to="/login" className="hover:underline font-bold transition-all" style={{ color: '#8c6c3f' }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
