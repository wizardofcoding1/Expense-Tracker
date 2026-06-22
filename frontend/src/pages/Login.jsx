import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import bgImage from '../assets/Gemini_Generated_Image_lua8zilua8zilua8.png';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        navigate('/');
      } else {
        setError(res.message || 'Invalid email or password.');
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
      <div className="w-full max-w-md z-10 animate-page-transition">
        {/* App identity */}
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-3xl font-extrabold tracking-wider bg-gradient-to-r from-[#b39262] via-[#d6c29b] to-[#8c6c3f] bg-clip-text text-transparent m-0">
            FINTRACK
          </h2>
          <p className="text-sm mt-2 font-medium" style={{ color: '#8c6c3f' }}>Manage your wealth, tracking made beautiful</p>
        </div>

        {/* Login form card */}
        <div className="gold-panel p-8 rounded-3xl">
          <h3 className="text-2xl font-bold mb-2" style={{ color: '#3d352b' }}>Welcome Back</h3>
          <p className="text-sm mb-6" style={{ color: '#8c6c3f' }}>Enter your details to access your account</p>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="gold-input w-full pl-11 pr-4 py-3 rounded-xl text-sm placeholder-stone-400"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider" style={{ color: '#8c6c3f' }}>
                  Password
                </label>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center" style={{ color: '#b39262' }}>
                  <Lock size={18} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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
              className="gold-button w-full mt-2 py-3 px-4 rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-6 p-4 rounded-2xl gold-panel text-center text-sm">
          <span style={{ color: '#8c6c3f' }}>Don't have an account? </span>
          <Link to="/register" className="hover:underline font-extrabold transition-all" style={{ color: '#3d352b' }}>
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
