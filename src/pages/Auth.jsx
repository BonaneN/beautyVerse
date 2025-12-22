import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Auth = ({ initialMode = 'login' }) => {
    const [isLogin, setIsLogin] = useState(initialMode === 'login');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, register, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (user) navigate('/dashboard');
    }, [user, navigate]);

    useEffect(() => {
        if (location.pathname === '/login') setIsLogin(true);
        if (location.pathname === '/register') setIsLogin(false);
    }, [location.pathname]);

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError('');
        window.history.pushState({}, '', isLogin ? '/register' : '/login');
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                if (!formData.username || !formData.password) {
                    setError('Username and password are required');
                    setLoading(false);
                    return;
                }
                const result = await login(formData.username, formData.password);
                if (result.success) {
                    navigate('/dashboard');
                } else {
                    setError(result.message || 'Login failed');
                }
            } else {
                if (!formData.username || !formData.email || !formData.password || !formData.first_name) {
                    setError('All fields are required for registration');
                    setLoading(false);
                    return;
                }
                const result = await register(formData);
                if (result.success) {
                    setIsLogin(true);
                    setError('Account created! Please sign in.');
                    window.history.pushState({}, '', '/login');
                } else {
                    setError(result.message || 'Registration failed');
                }
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const SocialHeader = () => (
        <div className="flex gap-3 my-5">
            <a href="#" className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center font-bold text-night-bordeaux hover:bg-gray-100 transition-colors" aria-label="Facebook">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.14H7.27v4.14H9.5V23.5h5V11.6h3.27l1-4.14z" /></svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center font-bold text-night-bordeaux hover:bg-gray-100 transition-colors" aria-label="Google">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M21.35 11.1h-9.17v2.73h5.14c-.22 1.1-.88 2.03-1.85 2.68v2.23h3c1.74-1.6 2.74-3.95 2.74-6.75 0-.64-.06-1.26-.14-1.88zM12.18 21c2.43 0 4.47-.8 5.96-2.18l-3-2.23c-.83.56-1.89.89-2.96.89-2.28 0-4.21-1.54-4.9-3.61H4.18v2.3C5.66 19.14 8.68 21 12.18 21zM7.28 13.87c-.17-.52-.27-1.07-.27-1.64s.1-1.12.27-1.64V8.29H4.18C3.57 9.5 3.23 10.87 3.23 12.27s.34 2.77.95 3.98l3.1-2.38zM12.18 6.51c1.32 0 2.5.45 3.44 1.34l2.58-2.58C16.63 3.86 14.59 3 12.18 3c-3.5 0-6.52 1.86-8 4.71l3.1 2.38c.69-2.07 2.62-3.61 4.9-3.61z" /></svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center font-bold text-night-bordeaux hover:bg-gray-100 transition-colors" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" /></svg>
            </a>
        </div>
    );

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-80px)] bg-soft-apricot font-body">
            <div className={`relative bg-white rounded-3xl shadow-premium overflow-hidden w-full max-w-[1000px] min-h-[600px] transition-all duration-600 ${isLogin ? '' : 'auth-right-active'}`}>

                {/* Sign Up Form */}
                <div className={`absolute top-0 h-full w-1/2 transition-all duration-600 ${isLogin ? 'left-0 opacity-0 z-[1]' : 'left-0 translate-x-full opacity-100 z-[5]'}`}>
                    <form onSubmit={handleSubmit} className="bg-white flex flex-col items-center justify-center px-12 h-full text-center">
                        <h1 className="font-heading font-bold text-3xl mb-0">Create Account</h1>
                        <SocialHeader />
                        <span className="text-xs text-gray-600 mb-5">or use your email for registration</span>
                        <input type="text" name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} autoComplete="given-name" className="bg-gray-200 border-none p-3 my-2 w-full rounded-lg" />
                        <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} autoComplete="username" className="bg-gray-200 border-none p-3 my-2 w-full rounded-lg" />
                        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} autoComplete="email" className="bg-gray-200 border-none p-3 my-2 w-full rounded-lg" />
                        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} autoComplete="new-password" className="bg-gray-200 border-none p-3 my-2 w-full rounded-lg" />
                        {error && !isLogin && <p className="text-berry-crush text-sm mt-2">{error}</p>}
                        <button type="submit" disabled={loading} className="mt-3 rounded-full border border-blush-rose bg-blush-rose text-white text-xs font-bold py-3 px-11 uppercase tracking-wide transition-transform active:scale-95">
                            {loading ? 'Processing...' : 'SIGN UP'}
                        </button>
                    </form>
                </div>

                {/* Sign In Form */}
                <div className={`absolute top-0 h-full w-1/2 left-0 z-[2] transition-all duration-600 ${isLogin ? '' : 'translate-x-full'}`}>
                    <form onSubmit={handleSubmit} className="bg-white flex flex-col items-center justify-center px-12 h-full text-center">
                        <h1 className="font-heading font-bold text-3xl mb-0">Sign in</h1>
                        <SocialHeader />
                        <span className="text-xs text-gray-600 mb-5">or use your account</span>
                        <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} autoComplete="username" className="bg-gray-200 border-none p-3 my-2 w-full rounded-lg" />
                        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} autoComplete="current-password" className="bg-gray-200 border-none p-3 my-2 w-full rounded-lg" />
                        {error && isLogin && <p className="text-berry-crush text-sm mt-2">{error}</p>}
                        <a href="#" className="text-sm text-gray-800 no-underline my-4" onClick={(e) => e.preventDefault()}>Forgot your password?</a>
                        <button type="submit" disabled={loading} className="rounded-full border border-[#ff4b2b] bg-[#ff4b2b] text-white text-xs font-bold py-3 px-11 uppercase tracking-wide transition-transform active:scale-95">
                            {loading ? 'Signing in...' : 'SIGN IN'}
                        </button>
                    </form>
                </div>

                <div className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-600 z-[100] ${isLogin ? '' : '-translate-x-full'}`}>
                    <div className={`bg-gradient-to-r from-blush-rose to-berry-crush text-white relative -left-full h-full w-[200%] transition-transform duration-600 ${isLogin ? 'translate-x-0' : 'translate-x-1/2'}`}>

                        <div className={`absolute flex items-center justify-center flex-col px-10 text-center top-0 h-full w-1/2 transition-transform duration-600 ${isLogin ? '-translate-x-1/5' : 'translate-x-0'}`}>
                            <h1 className="font-heading font-bold text-3xl mb-2">Welcome Back!</h1>
                            <p className="text-sm mb-6">To keep connected with us please login with your personal info</p>
                            <button className="rounded-full border-2 border-white bg-transparent text-white text-xs font-bold py-3 px-11 uppercase tracking-wide transition-transform active:scale-95" onClick={toggleMode}>SIGN IN</button>
                        </div>

                        <div className={`absolute right-0 flex items-center justify-center flex-col px-10 text-center top-0 h-full w-1/2 transition-transform duration-600 ${isLogin ? 'translate-x-0' : 'translate-x-1/5'}`}>
                            <h1 className="font-heading font-bold text-3xl mb-2">Hello, Friend!</h1>
                            <p className="text-sm mb-6">Enter your personal details and start journey with us</p>
                            <button className="rounded-full border-2 border-white bg-transparent text-white text-xs font-bold py-3 px-11 uppercase tracking-wide transition-transform active:scale-95" onClick={toggleMode}>SIGN UP</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Auth;
