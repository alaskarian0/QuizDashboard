import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileQuestion,
  Users,
  BookOpen,
  Library,
  LogOut,
  Moon,
  Sun,
  Network,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface AdminLayoutProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

type MenuItem = {
  id: string;
  path: string;
  icon: any;
  label: string;
  color: string;
};

export function AdminLayout({ isDark, onToggleTheme }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems: MenuItem[] = [
    { id: 'overview', path: '/admin/dashboard', icon: LayoutDashboard, label: 'لوحة القيادة', color: 'emerald' },
    { id: 'questions', path: '/admin/questions', icon: FileQuestion, label: 'إدارة الأسئلة', color: 'blue' },
    { id: 'courses', path: '/admin/courses', icon: BookOpen, label: 'إدارة الدورات', color: 'purple' },
    { id: 'users', path: '/admin/users', icon: Users, label: 'إدارة المستخدمين', color: 'amber' },
    { id: 'learning-path', path: '/admin/learning-path', icon: GraduationCap, label: 'المسار التعليمي', color: 'rose' },
    { id: 'library', path: '/admin/library', icon: Library, label: 'المحتوى التعليمي', color: 'indigo' },
    { id: 'hierarchical', path: '/admin/hierarchical-view', icon: Network, label: 'عرض شجري البيانات', color: 'teal' },
  ];

  const handleLogout = () => {
    // Use the logout function from useAuth hook
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div
      dir="rtl"
      className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#0D1B1A]' : 'bg-[#F9F6ED]'
        }`}
      style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
    >
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className={`w-64 ${isDark ? 'bg-[#1A2C2B] border-l border-[#2a5a4d]' : 'bg-white border-l border-gray-200'
          } flex flex-col`}>
          {/* Logo */}
          <div className="p-6 border-b border-opacity-20" style={{ borderColor: isDark ? '#2a5a4d' : '#e5e5e5' }}>
            <h1
              className={`text-2xl text-center ${isDark ? 'text-white' : 'text-[#222222]'}`}
              style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}
            >
              🎓 لوحة التحكم
            </h1>
            <p className={`text-center text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              نور المعرفة
            </p>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive(item.path)
                    ? isDark
                      ? 'bg-emerald-600 text-white shadow-lg'
                      : 'bg-[#0AA1DD] text-white shadow-lg'
                    : isDark
                      ? 'text-gray-300 hover:bg-[#0D1B1A]'
                      : 'text-gray-700 hover:bg-[#79DAE8]/20'
                  }`}
              >
                <item.icon className="w-5 h-5" />
                <span style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                  {item.label}
                </span>
              </button>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-opacity-20 space-y-2" style={{ borderColor: isDark ? '#2a5a4d' : '#e5e5e5' }}>
            <button
              onClick={onToggleTheme}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isDark ? 'text-gray-300 hover:bg-[#0D1B1A]' : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              <span style={{ fontFamily: "'Cairo', sans-serif" }}>
                {isDark ? 'الوضع الفاتح' : 'الوضع الداكن'}
              </span>
            </button>
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isDark ? 'text-red-400 hover:bg-red-900/20' : 'text-red-600 hover:bg-red-50'
                }`}
            >
              <LogOut className="w-5 h-5" />
              <span style={{ fontFamily: "'Cairo', sans-serif" }}>تسجيل الخروج</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
