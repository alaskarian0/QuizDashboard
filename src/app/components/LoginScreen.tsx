import { useState, useEffect } from 'react';
import { Moon, Sun, User, Lock } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useAuth } from '../../hooks/useAuth';

interface LoginScreenProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export function LoginScreen({ isDark, onToggleTheme }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { login, isLoginLoading, error: authError } = useAuth();

  useEffect(() => {
    if (authError) {
      const msg = typeof authError === 'string'
        ? authError
        : (authError as any).message || 'Invalid credentials';
      setErrorMessage(msg);
    }
  }, [authError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username || !password) {
      setErrorMessage('Please enter both username and password');
      return;
    }

    try {
      await login(username, password);
    } catch (error) {
      setErrorMessage('Invalid username or password');
    }
  };

  return (
    <div
      dir="rtl"
      className={`relative overflow-hidden min-h-screen transition-colors duration-300 ${isDark
        ? 'bg-gradient-to-br from-[#0D1B1A] via-[#1A2C2B] to-[#0D1B1A]'
        : 'bg-gradient-to-br from-emerald-900 via-teal-800 to-emerald-950'
        }`}
      style={{ fontFamily: "'Cairo', sans-serif" }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1561865406-62a037159577?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpc2xhbWljJTIwZ2VvbWV0cmljJTIwcGF0dGVybnxlbnwxfHx8fDE3Njg3MDAzODl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Islamic pattern"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={onToggleTheme}
          className={`p-3 rounded-xl transition-all ${isDark ? 'bg-[#1A2C2B] text-[#D6C39B] border border-[#2a5a4d]' : 'bg-white text-[#B6904E] shadow-md'
            }`}
        >
          {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
      </div>

      <div className="relative z-10 max-w-md mx-auto px-6 py-12 flex flex-col justify-center min-h-screen">
        <div className="text-center mb-10">
          <h1 className={`text-3xl mb-2 ${isDark ? 'text-white' : 'text-white'}`} style={{ fontWeight: 700 }}>
            نور المعرفة
          </h1>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-emerald-100'}`}>
            لوحة الإدارة للتحكم في محتوى التطبيق
          </p>
        </div>

        <div className={`p-8 rounded-3xl ${isDark ? 'bg-[#1A2C2B] border border-[#2a5a4d]' : 'bg-white/95 shadow-xl backdrop-blur-sm'}`}>
          <h2 className={`text-xl mb-6 text-center ${isDark ? 'text-white' : 'text-gray-800'}`} style={{ fontWeight: 600 }}>
            تسجيل دخول المدير
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={`block text-sm mb-2 mr-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                اسم المستخدم
              </label>
              <div className="relative">
                <User className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-emerald-500' : 'text-emerald-600'}`} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="أدخل اسم المستخدم"
                  className={`w-full p-4 pr-12 rounded-2xl outline-none transition-all border-2 ${isDark
                    ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-emerald-500 placeholder-gray-500'
                    : 'bg-[#F9F6ED] border-transparent text-gray-800 focus:border-emerald-500 focus:bg-white placeholder-gray-400'
                    }`}
                  required
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm mb-2 mr-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-emerald-500' : 'text-emerald-600'}`} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور"
                  className={`w-full p-4 pr-12 rounded-2xl outline-none transition-all border-2 ${isDark
                    ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-emerald-500 placeholder-gray-500'
                    : 'bg-[#F9F6ED] border-transparent text-gray-800 focus:border-emerald-500 focus:bg-white placeholder-gray-400'
                    }`}
                  required
                />
              </div>
            </div>

            {errorMessage && (
              <p className="text-red-500 text-sm text-center font-medium">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoginLoading}
              className={`w-full p-4 rounded-2xl transition-all ${isDark
                ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                : 'bg-emerald-700 text-white hover:bg-emerald-600'
                } disabled:opacity-70`}
            >
              {isLoginLoading ? 'جاري التحقق...' : 'تسجيل الدخول'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}