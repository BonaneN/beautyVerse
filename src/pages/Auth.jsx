import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Auth = ({ initialMode = 'login' }) => {
    const [isLogin, setIsLogin] = useState(initialMode === 'login');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password2: '',
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
                if (!formData.username || !formData.email || !formData.password || !formData.password2) {
                    setError('All fields are required for registration');
                    setLoading(false);
                    return;
                }

                const registrationData = {
                    ...formData,
                    first_name: formData.username,
                    last_name: formData.username
                };

                const result = await register(registrationData);
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

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-80px)] bg-soft-apricot font-body">
            <div className={`relative bg-white rounded-3xl shadow-premium overflow-hidden w-full max-w-[1000px] min-h-[600px] transition-all duration-600 ${isLogin ? '' : 'auth-right-active'}`}>

                {/* Sign Up Form */}
                <div className={`absolute top-0 h-full w-1/2 transition-all duration-600 ${isLogin ? 'left-0 opacity-0 z-[1]' : 'left-0 translate-x-full opacity-100 z-[5]'}`}>
                    <form onSubmit={handleSubmit} className="bg-white flex flex-col items-center justify-center px-12 h-full text-center">
                        <h1 className="font-heading font-bold text-3xl mb-6 text-night-bordeaux">Create Account</h1>
                        <span className="text-sm text-gray-600 mb-6">Enter your details to get started</span>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            autoComplete="username"
                            className="bg-gray-100 border border-gray-200 focus:border-cotton-candy focus:ring-2 focus:ring-cotton-candy/20 outline-none p-3 my-2 w-full rounded-lg transition-all"
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            autoComplete="email"
                            className="bg-gray-100 border border-gray-200 focus:border-cotton-candy focus:ring-2 focus:ring-cotton-candy/20 outline-none p-3 my-2 w-full rounded-lg transition-all"
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="new-password"
                            className="bg-gray-100 border border-gray-200 focus:border-cotton-candy focus:ring-2 focus:ring-cotton-candy/20 outline-none p-3 my-2 w-full rounded-lg transition-all"
                        />
                        <input
                            type="password"
                            name="password2"
                            placeholder="Confirm Password"
                            value={formData.password2}
                            onChange={handleChange}
                            autoComplete="new-password"
                            className="bg-gray-100 border border-gray-200 focus:border-cotton-candy focus:ring-2 focus:ring-cotton-candy/20 outline-none p-3 my-2 w-full rounded-lg transition-all"
                        />

                        {error && !isLogin && <p className="text-berry-crush text-sm mt-2 font-medium">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-4 rounded-full bg-cotton-candy hover:bg-blush-rose text-night-bordeaux hover:text-white text-sm font-bold py-3 px-12 uppercase tracking-wide transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                        >
                            {loading ? 'Processing...' : 'SIGN UP'}
                        </button>
                    </form>
                </div>

                {/* Sign In Form */}
                <div className={`absolute top-0 h-full w-1/2 left-0 z-[2] transition-all duration-600 ${isLogin ? '' : 'translate-x-full'}`}>
                    <form onSubmit={handleSubmit} className="bg-white flex flex-col items-center justify-center px-12 h-full text-center">
                        <h1 className="font-heading font-bold text-3xl mb-6 text-night-bordeaux">Sign in</h1>
                        <span className="text-sm text-gray-600 mb-6">Welcome back! Please login to your account</span>

                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            autoComplete="username"
                            className="bg-gray-100 border border-gray-200 focus:border-cotton-candy focus:ring-2 focus:ring-cotton-candy/20 outline-none p-3 my-2 w-full rounded-lg transition-all"
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                            className="bg-gray-100 border border-gray-200 focus:border-cotton-candy focus:ring-2 focus:ring-cotton-candy/20 outline-none p-3 my-2 w-full rounded-lg transition-all"
                        />

                        {error && isLogin && <p className="text-berry-crush text-sm mt-2 font-medium">{error}</p>}

                        <a href="#" className="text-sm text-berry-crush hover:text-blush-rose no-underline my-4 transition-colors" onClick={(e) => e.preventDefault()}>
                            Forgot your password?
                        </a>

                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-full bg-blush-rose hover:bg-berry-crush text-white text-sm font-bold py-3 px-12 uppercase tracking-wide transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                        >
                            {loading ? 'Signing in...' : 'SIGN IN'}
                        </button>
                    </form>
                </div>

                {/* Overlay */}
                <div className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-600 z-[100] ${isLogin ? '' : '-translate-x-full'}`}>
                    <div className={`bg-gradient-to-r from-blush-rose to-berry-crush text-white relative -left-full h-full w-[200%] transition-transform duration-600 ${isLogin ? 'translate-x-0' : 'translate-x-1/2'}`}>

                        {/* Left Overlay Panel */}
                        <div className={`absolute flex items-center justify-center flex-col px-10 text-center top-0 h-full w-1/2 transition-transform duration-600 ${isLogin ? '-translate-x-1/5' : 'translate-x-0'}`}>
                            <h1 className="font-heading font-bold text-3xl mb-3">Welcome Back!</h1>
                            <p className="text-sm mb-8 opacity-90">To keep connected with us please login with your personal info</p>
                            <button
                                className="rounded-full border-2 border-white bg-transparent hover:bg-white hover:text-blush-rose text-white text-xs font-bold py-3 px-11 uppercase tracking-wide transition-all active:scale-95"
                                onClick={toggleMode}
                            >
                                SIGN IN
                            </button>
                        </div>

                        {/* Right Overlay Panel */}
                        <div className={`absolute right-0 flex items-center justify-center flex-col px-10 text-center top-0 h-full w-1/2 transition-transform duration-600 ${isLogin ? 'translate-x-0' : 'translate-x-1/5'}`}>
                            <h1 className="font-heading font-bold text-3xl mb-3">Hello, Friend!</h1>
                            <p className="text-sm mb-8 opacity-90">Enter your personal details and start journey with us</p>
                            <button
                                className="rounded-full border-2 border-white bg-transparent hover:bg-white hover:text-blush-rose text-white text-xs font-bold py-3 px-11 uppercase tracking-wide transition-all active:scale-95"
                                onClick={toggleMode}
                            >
                                SIGN UP
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Auth;
